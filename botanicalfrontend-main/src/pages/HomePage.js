import React from "react";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("homepage_title")}</h1>
      <p>{t("homepage_description")}</p>
    </div>
  );
}

export default HomePage;
