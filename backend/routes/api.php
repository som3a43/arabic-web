<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\PdfExportController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\NotesController;
use App\Http\Controllers\Api\DebugController;

Route::middleware('cors')->group(function () {

    // Public routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/profile', [AuthController::class, 'profile']);

        // Sections
        Route::get('/sections', [SectionController::class, 'index']);
        Route::post('/sections', [SectionController::class, 'store']);
        Route::delete('/sections/{id}', [SectionController::class, 'destroy']);

        // Tables
        Route::get('/tables', [TableController::class, 'index']);
        Route::post('/tables', [TableController::class, 'store']);
        Route::post('/tables/save-all', [TableController::class, 'saveAll']);
        Route::get('/tables/{table}', [TableController::class, 'show']);
        Route::put('/tables/{table}', [TableController::class, 'update']);
        Route::delete('/tables/{table}', [TableController::class, 'destroy']);
        
        
        // Table rows
        Route::post('/tables/{table}/rows', [TableController::class, 'addRow']);
        Route::put('/rows/{row}', [TableController::class, 'updateRow']);
        Route::delete('/rows/{row}', [TableController::class, 'deleteRow']);
        
        // Images
        Route::get('/images', [ImageController::class, 'index']);
        Route::post('/images', [ImageController::class, 'store']);
        Route::delete('/images/{image}', [ImageController::class, 'destroy']);

        // Table rename
        Route::patch('/tables/{table}/rename', [TableController::class, 'rename']);

        // Notes
        Route::post('/notes', [NotesController::class, 'store']);
        Route::get('/notes', [NotesController::class, 'index']);
        Route::get('/notes/{table_name}', [NotesController::class, 'show']);
        Route::put('/notes/{id}', [NotesController::class, 'update']);
        Route::delete('/notes/{id}', [NotesController::class, 'destroy']);
        
        // Admin
        Route::middleware('admin')->group(function () {
            Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
            Route::get('/admin/users/{user}', [AdminController::class, 'getUserDetails']);
            Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
        });

        });
    // PDF Export
    Route::get('/tables/{table}/export', [PdfExportController::class, 'exportTable']);
    });
    