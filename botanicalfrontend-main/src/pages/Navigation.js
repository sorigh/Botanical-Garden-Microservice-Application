// Navigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../LoginLogic/useAuth";
import { useTranslation } from 'react-i18next';

function Navigation() {
  
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const hasRole = (allowedRoles) => {
    if (!auth || !auth.roles) return false;
    return allowedRoles.some(role => auth.roles.includes(role));
  };

  
  return (
    <nav className="nav-menu">
      <Link to="/">{t("home")}</Link>
      <Link to="/plants">{t('plants')}</Link>
      <Link to="/specimens">{t("specimens")}</Link>
      <Link to="/plantsandspecimens">{t("plants_and_specimens")}</Link>

      {hasRole([
        "ROLE_USER",
        "ROLE_EMPLOYEE",
        "ROLE_MANAGER",
        "ROLE_ADMINISTRATOR",
      ]) && <Link to="/personaldata">{t("personal_info")}</Link>}

      {!auth && <Link to="/login-page">{t("login")}</Link>}

      {hasRole(["ROLE_ADMINISTRATOR"]) && <Link to="/users">{t("manage_users")}</Link>}

      {/* Language selector */}
      <select
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        value={i18n.language}
        style={{ marginLeft: "auto", width: "80px", fontSize: "0.8rem", padding: "2px" }}
      >
        <option value="ro">RO</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>

    </nav>
  );
}

export default Navigation;
