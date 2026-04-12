const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} SampleSite. All Rights Reserved.
        </p>
      </footer>
      <style>{`
        .footer {
          background: #222;
          color: #eee;
          text-align: center;
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default Footer;
