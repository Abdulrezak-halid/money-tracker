import React from "react";
import { Category } from "../types";
import {
  FaBasketShopping,
  FaBus,
  FaUtensils,
  FaShirt,
  FaFileInvoiceDollar,
  FaGamepad,
  FaHeartPulse,
  FaGraduationCap,
  FaSprayCanSparkles,
  FaLaptopCode,
  FaHouseChimney,
  FaGift,
  FaEllipsis,
} from "react-icons/fa6";

export const getCategoryIcon = (category: Category) => {
  switch (category) {
    case Category.MARKET:
      return <FaBasketShopping />;
    case Category.ULASIM:
      return <FaBus />;
    case Category.YEMEK:
      return <FaUtensils />;
    case Category.GIYIM:
      return <FaShirt />;
    case Category.FATURA:
      return <FaFileInvoiceDollar />;
    case Category.EGLENCE:
      return <FaGamepad />;
    case Category.SAGLIK:
      return <FaHeartPulse />;
    case Category.EGITIM:
      return <FaGraduationCap />;
    case Category.KOZMETIK:
      return <FaSprayCanSparkles />;
    case Category.TEKNOLOJI:
      return <FaLaptopCode />;
    case Category.EV:
      return <FaHouseChimney />;
    case Category.HEDIYE:
      return <FaGift />;
    case Category.DIGER:
    default:
      return <FaEllipsis />;
  }
};
