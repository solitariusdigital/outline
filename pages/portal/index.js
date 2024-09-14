import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import Register from "@/components/Register";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";

export default function Index() {
  const { currentUser, setCurrentUser } = useContext(StateContext);

  return (
    <Fragment>
      <NextSeo
        title="اوت لاین"
        description="خدمات آنلاین"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "اوت لاین",
          description: "خدمات آنلاین",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت لاین",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      {!currentUser && (
        <div className="register">
          <Register></Register>
        </div>
      )}
    </Fragment>
  );
}
