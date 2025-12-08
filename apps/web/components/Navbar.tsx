import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <nav>
        <div>logo</div>
        <ul>
          <li>
            <Link href="/">Features</Link>
          </li>
          <li>
            <Link href="/">How it Works</Link>
          </li>
          <li>
            <Link href="/">Documentation</Link>
          </li>
          <li>
            <Link href="/">About</Link>
          </li>
        </ul>

        <div>
            <ul>
                <li><Link href="/sign-up">Get Started</Link></li>
                <li><Link href="/sign-in">Sign In</Link></li>
            </ul>
        </div>
      </nav>
    </div>
  );
}
