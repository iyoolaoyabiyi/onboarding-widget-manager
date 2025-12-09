import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="font-bold text-xl">logo</div>
      
      <ul className="hidden md:flex items-center gap-8">
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Features
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            How it Works
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Documentation
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            About
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-4">
        <li>
          <Link href="/sign-up" className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity">
            Get Started
          </Link>
        </li>
        <li>
          <Link href="/sign-in" className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity">
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}