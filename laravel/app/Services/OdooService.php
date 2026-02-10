<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
// Añadidos para que funcione tu método 'store' del final:
class OdooService
{
    protected $url;
    protected $db;
    protected $username;
    protected $password;
    protected $timeout;
    protected $retries;

    public function __construct() // necesario para leer el env
    {
        $this->url = rtrim(env("ODOO_URL"), '/') . '/jsonrpc';
        $this->db = env("ODOO_DB");
        $this->username = env("ODOO_USERNAME");
        $this->password = env("ODOO_PASSWORD");
        $this->timeout = env("ODOO_TIMEOUT", 30);
        $this->retries = env("ODOO_RETRIES", 3);
    }

    public function create(string $model, array $data) //para el export?
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

    public function searchRead(string $model, array $domain = [], array $fields = []) // para el import
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

    public function write(string $model, array $args)//para el edit
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
    protected function authenticate()// crea uid, sin uid no hay nada... aunque es para users.
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
    protected function rpc($service, $method, $args) // único método que usa http::post. Centraliza el flujo de datos. COMUNICA
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

            throw $e;
        }
    }
}
