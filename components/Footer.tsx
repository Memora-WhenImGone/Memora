import React from 'react'



const Footer = () => {
  return (
    <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Memora. When I am gone.
        </div>
      </footer>
  )
}

export default Footer;
