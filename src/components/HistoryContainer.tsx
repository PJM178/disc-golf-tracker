const HistoryContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className={"title--container"}>
        <div>Historia</div>
      </div>
      {children}
    </div>
  );
};

export default HistoryContainer;