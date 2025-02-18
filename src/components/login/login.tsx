'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-[#3d4753] p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-[#ffffff] mb-6 text-center">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <input
  type="text"
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="w-full p-3 rounded bg-[#111820] text-[#ffffff] border border-[#facc16] 
  focus:outline-none focus:ring-2 focus:ring-[#facc16] 
  autofill:bg-[#111820] autofill:text-[#ffffff]
  [-webkit-autofill:focus]:bg-[#111820] [-webkit-autofill:hover]:bg-[#111820] [-webkit-autofill:active]:bg-[#111820] [-webkit-autofill]:bg-[#111820]
  [-webkit-autofill]:text-[#ffffff] [-webkit-autofill]:shadow-[0_0_0_30px_#111820_inset]"
/>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#111820] text-[#ffffff] border border-[#facc16] focus:outline-none focus:ring-2 focus:ring-[#facc16]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#facc16] text-[#111828] p-3 rounded font-semibold hover:bg-[#facc16]/90 transition-colors"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-[#ffffff]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#facc16] hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}