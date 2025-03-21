import {
  BsSpeedometer,
  BsPeople,
  BsEmojiSmile,
  BsCollectionPlay,
  BsCardChecklist,
  BsBarChart,
  BsGlobe,
  BsToggles2,
  BsHandIndexThumb,
  BsHeadphones,
  BsListCheck,
  BsReceipt,
  BsBell,
  BsFiles,
  BsListTask,
  BsBuilding,
  BsPersonLinesFill,
  BsCashStack,
  BsExclamationDiamond,
  BsChatSquareDots,
  BsPersonPlus,
  BsGenderTrans,
  BsPersonGear,
} from "react-icons/bs";

export const getIcons = (icon) => {
  if (typeof icon != "function") {
    switch (icon) {
      case "BsSpeedometer":
        return <BsSpeedometer className="text-orange" />;
      case "BsPeople":
        return <BsPeople className="text-orange" />;
      case "BsEmojiSmile":
        return <BsEmojiSmile className="text-orange" />;
      case "BsCollectionPlay":
        return <BsCollectionPlay className="text-orange" />;
      case "BsCardChecklist":
        return <BsCardChecklist className="text-orange" />;
      case "BsBarChart":
        return <BsBarChart className="text-orange" />;
      case "BsGlobe":
        return <BsGlobe className="text-orange" />;
      case "BsToggles2":
        return <BsToggles2 className="text-orange" />;
      case "BsHandIndexThumb":
        return <BsHandIndexThumb className="text-orange" />;
      case "BsHeadphones":
        return <BsHeadphones className="text-orange" />;
      case "BsListCheck":
        return <BsListCheck className="text-orange" />;
      case "BsReceipt":
        return <BsReceipt className="text-orange" />;
      case "BsBell":
        return <BsBell className="text-orange" />;
      case "BsFiles":
        return <BsFiles className="text-orange" />;
      case "BsListTask":
        return <BsListTask className="text-orange" />;
      case "BsBuilding":
        return <BsBuilding className="text-orange" />;
      case "BsPersonLinesFill":
        return <BsPersonLinesFill className="text-orange" />;
      case "BsCashStack":
        return <BsCashStack className="text-orange" />;
      case "BsExclamationDiamond":
        return <BsExclamationDiamond className="text-orange" />;
      case "BsGenderTrans":
        return <BsGenderTrans className="text-orange" />;
      case "BsChatSquareDots":
        return <BsChatSquareDots className="text-orange" />;
      case "BsPersonPlus":
        return <BsPersonPlus className="text-orange" />;
      case "BsPersonGear":
        return <BsPersonGear className="text-orange" />;
      default:
        return <BsSpeedometer className="text-orange" />;
    }
  } else {
    return <BsSpeedometer className="text-orange" />;
  }
};
