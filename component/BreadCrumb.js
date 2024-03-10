import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const BreadCrumb = ({ paths }) => {
  const { t: translate } = useTranslation("breadcrumb");
  return (
    <div>
      <ul className="ysp-breadcrumbs common-sec-horizontal-pad">
        <li>
          <Link href="/">{translate("home")}</Link>
        </li>
        {Boolean(paths) &&
          Array.isArray(paths) &&
          paths?.map((path) => (
            <li key={path?.url}>
              <Link href={path?.url}>{path?.title}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BreadCrumb;
