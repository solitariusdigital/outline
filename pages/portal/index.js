import { useState, useContext, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import Register from "@/components/Register";
import { NextSeo } from "next-seo";

export default function Index() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);

  const router = useRouter();
  let pathname = router.pathname;

  useEffect(() => {
    if (currentUser) {
      Router.push({
        pathname: `/portal/${currentUser.permission}`,
        query: { id: currentUser["_id"], p: currentUser.permission },
      });
    }
  }, [currentUser]);

  useEffect(() => {
    navigationTopBar.map((nav) => {
      if (nav.link === "/") {
        navigationTopBar[0].active = true;
      } else if (pathname.includes(nav.link)) {
        navigationTopBar[0].active = false;
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="خدمات آنلاین بل کلاس"
        description="مشاوره آنلاین رایگان و رزرو مراجعه حضوری"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
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
