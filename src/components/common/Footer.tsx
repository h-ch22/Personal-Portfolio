import { CONFIG } from '#/config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-muted text-muted-foreground flex flex-col text-sm p-4">
      <div className="font-semibold">{CONFIG.footer.email}</div>
      <div>
        &copy; 2026{year === 2026 ? '' : `-${year}`} {CONFIG.footer.name} All
        rights reserved.
      </div>

      <div>
        Conceived by
        <span className="font-semibold">Yujee Catherine Chang</span>, Built by{' '}
        <a href="https://github.com/h-ch22" className="font-semibold underline">
          Changjin Ha.
        </a>
      </div>
    </footer>
  )
}
