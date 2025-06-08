import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username dan password tidak boleh kosong');
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Username atau password salah');
    }
  };
  
  return (
    <div className="min-h-screen bg-ajinomoto-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img 
            src="https://www.ajinomoto.co.id/template/ajinomoto/logo/aji-logo-new2.svg" 
            alt="Ajinomoto Logo" 
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-ajinomoto-red">WMS RFID System</h2>
          <p className="mt-2 text-sm text-ajinomoto-gray-600">
            Warehouse Management System berbasis RFID
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Username"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              leftIcon={<User size={18} />}
              placeholder="Masukkan username"
            />
            
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              leftIcon={<Lock size={18} />}
              placeholder="Masukkan password"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-ajinomoto-red focus:ring-ajinomoto-red border-ajinomoto-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-ajinomoto-gray-700">
                Ingat saya
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-ajinomoto-blue hover:text-ajinomoto-red">
                Lupa password?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Masuk
          </Button>
          
          <div className="text-center text-xs text-ajinomoto-gray-500 mt-4">
            <p>© {new Date().getFullYear()} PT Ajinomoto Indonesia</p>
            <p>v1.1.0</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;