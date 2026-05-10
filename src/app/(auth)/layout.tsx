export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="font-heading text-xl font-bold" style={{ color: 'var(--white)' }}>
            Sum <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Goals</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
