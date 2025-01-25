import React from 'react'
import { useTranslation } from 'react-i18next';

const CustAnimalInfo = () => {
   const { t } = useTranslation("common");
  return (
    <div>
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">{t("c-page-title-animal")}</h2>
      </div>
    </div>
  );
}

export default CustAnimalInfo
