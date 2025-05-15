const CurrentGameContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className={"title--container"}>
        <div>Nykyinen</div>
      </div>
      {children}
    </div>
  );
};

export default CurrentGameContainer;