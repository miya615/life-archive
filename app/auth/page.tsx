"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("確認メールを送信しました。メールをご確認ください。");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage("メールアドレスまたはパスワードが正しくありません");
      } else {
        window.location.href = "/";
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-10 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <span className="text-white text-2xl">✦</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Life Archive
        </h1>
        <p className="text-sm text-gray-500 mt-1">人生を記録し、振り返る</p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-sm glass rounded-3xl p-8 shadow-xl shadow-indigo-100/50 animate-fade-up">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {isSignUp ? "アカウント作成" : "ログイン"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-white/60 text-gray-800 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-white/60 text-gray-800 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
              placeholder="6文字以上"
            />
          </div>

          {message && (
            <p
              className={`text-xs px-3 py-2 rounded-xl ${
                message.includes("メール")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-60 mt-2"
          >
            {loading ? "処理中..." : isSignUp ? "アカウントを作成" : "ログイン"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
          }}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          {isSignUp
            ? "すでにアカウントをお持ちの方はこちら"
            : "アカウントをお持ちでない方はこちら"}
        </button>
      </div>
    </div>
  );
}
