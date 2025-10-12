'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SocialLoginButton from '../components/SocialLoginButton';
import TermsAgreementModal from '../components/TermsAgreementModal';

export default function LoginPage() {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const handleSocialLogin = async (provider: string) => {
    // TODO: 실제 OAuth 플로우 구현
    console.log(`${provider} 로그인 시도`);

    // 시뮬레이션: 50% 확률로 신규 유저
    const isNewUser = Math.random() > 0.5;

    if (isNewUser) {
      // 신규 유저: 약관 동의 모달 표시
      setSelectedProvider(provider);
      setShowTermsModal(true);
    } else {
      // 기존 유저: 바로 로그인
      alert(`${provider} 로그인 성공! (기존 유저)`);
      // router.push('/dashboard');
    }
  };

  const handleTermsAgree = () => {
    setShowTermsModal(false);
    alert(`${selectedProvider} 회원가입 완료! (신규 유저)`);
    // router.push('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url("/image/login.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center p-6 relative z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-white hover:text-gray-200 border border-white/20 px-6 py-3 rounded-full backdrop-blur-sm transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-base font-light tracking-wide">Back</span>
        </button>
      </div>

      {/* 메인 컨텐츠 - 중앙 정렬 소셜 로그인 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl">
          {/* 로고 */}
          <div className="text-center mb-12">
            <div className="text-6xl text-black mb-3 font-montserrat font-bold">✦</div>
            <h1 className="text-4xl font-montserrat font-bold text-gray-900 tracking-tight">
              facadely
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-light">
              Sign in or create an account
            </p>
          </div>

          {/* 소셜 로그인 버튼 */}
          <div className="space-y-3 mb-8">
            <SocialLoginButton
              provider="Google"
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialLoginButton
              provider="Apple"
              onClick={() => handleSocialLogin('Apple')}
            />
            <SocialLoginButton
              provider="Facebook"
              onClick={() => handleSocialLogin('Facebook')}
            />
          </div>

          {/* 하단 안내 문구 */}
          <div className="text-center space-y-3 px-4">
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-black underline hover:text-gray-700">
                Terms of Service
              </Link>
              <br />
              and have read and understood the{' '}
              <Link href="/privacy" className="text-black underline hover:text-gray-700">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Secure Login with reCAPTCHA subject to Google
            </p>
          </div>
        </div>
      </div>

      {/* 약관 동의 모달 (신규 유저용) */}
      <TermsAgreementModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
        provider={selectedProvider}
      />
    </div>
  );
}
