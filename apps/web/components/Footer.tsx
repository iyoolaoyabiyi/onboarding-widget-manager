export default function Footer() {
  return (
    <div className="px-6 py-12 border-t-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-bold text-xl">product name</p>
        
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
          <p className="hover:opacity-70 transition-opacity cursor-pointer">
            Documentation
          </p>
          <p className="hover:opacity-70 transition-opacity cursor-pointer">
            Dashboard
          </p>
          <p className="hover:opacity-70 transition-opacity cursor-pointer">
            Privacy Policy
          </p>
          <p className="hover:opacity-70 transition-opacity cursor-pointer">
            Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}