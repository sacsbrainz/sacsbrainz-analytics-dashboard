import React from "react";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/web",
      permanent: false,
    },
  };
};

function Index() {
  return <div>We have moved</div>;
}

export default Index;
