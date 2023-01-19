import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { AuthProvider } from "../auth/AuthContext";
import { Content } from "../components/content";
import { Header } from "../components/header";
import { Login } from "../components/login";

type Props = {
  token: string;
};

const Home: NextPage<Props> = ({ token }) => {
  console.log('render')
  return (
    <AuthProvider token={token}>
      <Head>
        <title>readingmood</title>
        <meta
          name="description"
          content="Get AI-suggestions for songs to listen along while reading."
        />
      </Head>

      {token === "" ? <Login /> : <Content />}
      <Header />
    </AuthProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies["spotify-token"]) {
    const token: string = context.req.cookies["spotify-token"];
    return {
      props: { token: token },
    };
  } else {
    return {
      props: { token: "" },
    };
  }
};

export default Home;
