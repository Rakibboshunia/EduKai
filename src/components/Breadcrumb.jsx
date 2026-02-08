import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const { pathname } = useLocation();

  const pathParts = pathname.split("/").filter(Boolean);

  // ❌ remove role + ids
  let cleanedParts = pathParts.filter(
    (part) =>
      !["admin", "owner"].includes(part.toLowerCase()) &&
      !/^\d+$/.test(part)
  );

  // ❌ remove sop/create & sop/edit
  if (cleanedParts.includes("sop")) {
    cleanedParts = cleanedParts.filter(
      (part) => !["create", "edit"].includes(part)
    );
  }

  const formatWord = (word) => {
    if (word.toLowerCase() === "cv") return "CV";

    return word
      .replaceAll("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const title = cleanedParts.map(formatWord).join(" ");

  return (
    <div className="flex items-center">
      <h3 className="text-[#2D468A] text-3xl whitespace-nowrap">
        {title}
      </h3>
    </div>
  );
};
export default Breadcrumb;
