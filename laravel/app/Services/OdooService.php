<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OdooService
{
    protected $url;
    protected $db;
    protected $username;
    protected $password;
    protected $timeout;
    protected $retries;

    public function __construct()
    {
        $this->url = rtrim(env("ODOO_URL"), '/') . '/jsonrpc';
        $this->db = env("ODOO_DB");
        $this->username = env("ODOO_USERNAME");
        $this->password = env("ODOO_PASSWORD");
        $this->timeout = env("ODOO_TIMEOUT", 30); // Default 30 seconds
        $this->retries = env("ODOO_RETRIES", 3); // Default 3 retries
    }

    public function create(string $model, array $data)
    {
        $uid = $this->authenticate();

        return $this->rpc('object', 'execute_kw', [
            $this->db,
            $uid,
            $this->password,
            $model,
            'create',
            [$data]
        ]);
    }

    public function search(string $model, array $zutabe)
    {
        $uid = $this->authenticate();

        return $this->rpc('object', 'execute_kw', [
            $this->db,
            $uid,
            $this->password,
            $model,
            'search',
            [$zutabe]
        ]);
    }
    public function searchRead(string $model, array $domain = [], array $fields = [])
    {
        $uid = $this->authenticate();

        return $this->rpc('object', 'execute_kw', [
            $this->db,
            $uid,
            $this->password,
            $model,
            'search_read',
            [$domain],
            ['fields' => $fields]
        ]);
    }

    public function write(string $model, array $args)
    {
        $uid = $this->authenticate();

        return $this->rpc('object', 'execute_kw', [
            $this->db,
            $uid,
            $this->password,
            $model,
            'write',
            $args
        ]);
    }

    /**
     * Authenticate with Odoo and return user ID
     */
    protected function authenticate()
    {
        $uid = $this->rpc('common', 'login', [
            $this->db,
            $this->username,
            $this->password
        ]);

        if (!$uid) {
            throw new \Exception('Odoo: Credenciales incorrectas o BD no encontrada.');
        }

        return $uid;
    }

    /**
     * Make RPC call with retry and timeout handling
     */
    protected function rpc($service, $method, $args)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->retry($this->retries, 1000, function ($exception) {
                    // Only retry on connection timeouts
                    return $exception instanceof ConnectionException;
                })
                ->post($this->url, [
                    'jsonrpc' => '2.0',
                    'method' => 'call',
                    'params' => [
                        'service' => $service,
                        'method' => $method,
                        'args' => $args,
                    ],
                    'id' => rand(1, 999999),
                ]);

            // Check if the request was successful
            if ($response->failed()) {
                Log::error('Odoo API HTTP Error', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                    'url' => $this->url,
                ]);

                throw new \Exception("Odoo HTTP Error: Status {$response->status()}");
            }

            $jsonResponse = $response->json();

            if (isset($jsonResponse['error'])) {
                Log::error('Odoo API Error', [
                    'error' => $jsonResponse['error'],
                    'service' => $service,
                    'method' => $method,
                ]);

                throw new \Exception('Odoo Error: ' . json_encode($jsonResponse['error']));
            }

            return $jsonResponse['result'] ?? null;

        } catch (ConnectionException $e) {
            Log::error('Odoo Connection Timeout', [
                'message' => $e->getMessage(),
                'url' => $this->url,
                'timeout' => $this->timeout,
            ]);

            throw new \Exception('Odoo service is temporarily unavailable. Please try again later.');

        } catch (\Exception $e) {
            Log::error('Odoo Service Error', [
                'message' => $e->getMessage(),
                'url' => $this->url,
            ]);

            throw $e; // Re-throw for controller to handle
        }
    }

    /**
     * Test Odoo connection
     */
    public function testConnection(): array
    {
        try {
            $uid = $this->rpc('common', 'login', [
                $this->db,
                $this->username,
                $this->password
            ]);

            return [
                'success' => true,
                'message' => 'Connection successful',
                'user_id' => $uid,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get Odoo server info
     */
    public function getServerInfo(): array
    {
        return [
            'url' => $this->url,
            'timeout' => $this->timeout,
            'retries' => $this->retries,
            'db' => $this->db,
            'username' => $this->username,
        ];
    }

    public function store(Request $request, OdooService $odooService)
    {
        // 1. Validar y crear en Laravel (MySQL)
        $ataza = Ataza::create($request->all());

        try {
            // 2. Enviar a Odoo
            $odooService->create('task_tracer.ataza', [
                'izena' => $ataza->izena,
                'egoera' => $ataza->egoera->value, // Usamos el valor del Enum
                'data' => $ataza->data ? $ataza->data->format('Y-m-d') : null,
                'laravel_id' => $ataza->id,
                // Importante: Aquí deberías pasar IDs de Odoo, no de Laravel
                // 'arduraduna_id' => $id_de_usuario_en_odoo,
            ]);
        } catch (\Exception $e) {
            // Logueamos el error pero permitimos que Laravel siga
            // para no romper la experiencia del usuario si falla Odoo
            Log::error("Error sincronizando con Odoo: " . $e->getMessage());
        }

        return redirect()->back();
    }
}
