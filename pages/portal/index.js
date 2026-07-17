import { useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import Register from "@/components/Register";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";

export default function Index() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);

  useEffect(() => {
    setMenuMobile(true);
    setTimeout(() => {
      setMenuDisplay(false);
      setFooterDisplay(false);
    }, 100);
  }, []);

  return (
    <Fragment>
      <NextSeo
        title={language ? "پورتال" : "Portal"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/portal"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/portal",
          title: language ? "پورتال" : "Portal",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت‌لاین",
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
