import Layout from "@/components/Layout/LandingLayout/Layout";

const Landing = () => {
  return (
    <Layout>
      <main className="content">
        <h1>Welcome to SampleSite!</h1>
        <p>Your modern, responsive landing page built with React.</p>
        <style>{`
          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }
        `}</style>
      </main>
    </Layout>
  );
};

export default Landing;
