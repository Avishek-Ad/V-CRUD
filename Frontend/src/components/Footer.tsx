function Footer() {
  return (
    <footer className="bg-background text-textsecondary py-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} VCRUD. All rights reserved.
        </p>

        <div className="flex space-x-4">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
