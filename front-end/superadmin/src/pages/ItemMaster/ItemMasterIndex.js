import React from "react";
import { useParams } from "react-router-dom";
import AllItemOverview from "./AllItemOverview";
import FundItem from "./FundItem";
import StockItem from "./StockItem";
import AllBrandsOverview from "./AllBrandsOverview";
import ViewAllFunds from "./ViewAllFunds";
import AllSubCategoryOverview from "./AllSubCategoryOverview";

export default function ItemMasterIndex() {
  const params = useParams();
  return (
    <>
      {params.page == "fund-item" && <FundItem />}
      {params.page == "view" && <ViewAllFunds />}
      {params.page == "stock-item" && <StockItem />}
      {params.page == "all-item-overview" && <AllItemOverview />}
      {params.page == "all-brand-overview" && <AllBrandsOverview />}
      {params.page == "all-sub-category-overview" && <AllSubCategoryOverview />}
    </>
  );
}
