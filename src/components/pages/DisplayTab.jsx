export default function DisplayTab({
  activeTab,
  ownedFilter,
  createCard,
  dataSearch,
}) {
  switch (activeTab) {
    case 0:
      return (
        <div className="overflow-y-auto">
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
            {dataSearch.map(createCard)}
          </div>
        </div>
      );
    case 1:
      return (
        <div className="overflow-y-auto">
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
            {ownedFilter.map(createCard)}
          </div>
        </div>
      );
    default:
      return <></>;
  }
}
