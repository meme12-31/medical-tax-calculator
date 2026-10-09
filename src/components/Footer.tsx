import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import logoImg from '../../public/images/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 pt-10 pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* サイト免責事項・プライバシー（2カラム） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-slate-800">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">税制免責事項・注意事項</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              当シミュレーターの計算結果は、現行の国税庁税制および標準的な税率に基づいた概算値です。各自治体ごとの均等割や個別の税額控除等により実際の還付金額や税額と異なる場合があります。正確な申告手続きにつきましては、所轄の税務署または税理士へご相談ください。
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">プライバシーと安全性</h4>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                当ツールで入力された収入や医療費などの個人情報は、サーバーに送信されず、お使いのブラウザ内部（LocalStorage）でのみ安全に処理・保持されます。
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              対応年度: 2026年（令和8年）確定申告基準 / 最終更新: 2026年2月
            </p>
          </div>
        </div>

        {/* フッターロゴ & ナビゲーション & コピーライト（完全中央揃え） */}
        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* 上段：ロゴ画像リンク（白背景コンテナ） */}
          <Link
            href="https://hit-tool.com/"
            className="inline-flex items-center justify-center bg-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-xs"
            title="HITtools - 無料Webツールポータル"
          >
            <Image
              src={logoImg}
              alt="HITtools"
              className="h-8 w-auto mx-auto object-contain"
            />
          </Link>

          {/* 中段：3つのテキストリンク（横並び） */}
          <ul className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <li>
              <Link
                href="https://hit-tool.com/about"
                className="hover:text-white transition-colors"
              >
                運営者情報
              </Link>
            </li>
            <li>
              <Link
                href="https://hit-tool.com/privacy"
                className="hover:text-white transition-colors"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="https://hit-tool.com/contact"
                className="hover:text-white transition-colors"
              >
                お問い合わせ
              </Link>
            </li>
          </ul>

          {/* 下段：コピーライト表記 */}
          <p className="text-xs text-slate-400">
            &copy; hit-tool.com All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
