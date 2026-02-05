<?php

namespace App\Http\Controllers\Api;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;

class SectionController extends Controller
{
   public function index(Request $request)
    {
        // جرب جلب أول مستخدم كمثال
        $user = $request->user();
        
        // إذا مفيش مستخدم (مثلاً Sanctum Token مش شغال)، خلي user_id ثابت للتجربة
        if (!$user) {
            $user_id = 40; // غيره لأي user_id موجود عندك في الجدول
        } else {
            $user_id = $user->id;
        }

        // جلب الأقسام الخاصة بالمستخدم
        $sections = Section::where('user_id', $user_id)
            ->orderBy('name')
            ->get(['id','name']);

        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $name = trim($validated['name']);
        // prevent duplicates
        $exists = Section::where('user_id', $user->id)->where('name', $name)->exists();
        if ($exists) {
            return response()->json(['message' => 'Section already exists'], 422);
        }

        $section = Section::create(['user_id' => $user->id, 'name' => $name]);

        return response()->json(['id' => $section->id, 'name' => $section->name], 201);
    }


    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $section = Section::find($id);
        if (!$section) {
            return response()->json(['message' => 'Section not found'], 404);
        }

        if ($section->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        try {
            Log::info('Deleting section', ['section_id' => $section->id, 'user_id' => $user->id]);
        } catch (\Exception $e) {
            // ignore logging errors
        }

        $section->delete();

        return response()->json(['message' => 'Section deleted successfully'], 200);
    }
}
