import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">404 - ページが見つかりません</h2>
      <p className="text-sm text-slate-600">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-500 transition-colors"
      >
        計算ツールトップへ戻る
      </Link>
    </div>
  );
}
