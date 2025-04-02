import style from "./Reports.module.scss";

export function Reports() {
  return (
    <>
      <div className={style.corpo}>
        <iframe
          title="dash stokeeper"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiYmQxNzE0NTQtYTQ0MC00MGIyLWJjYjktNjBiNjc3NTQ5NzFjIiwidCI6IjIxNjJiYmNlLTYzOWEtNGE0ZS04NjYwLWM5ZTU4YzFkYjM2MiJ9"
          frameBorder="0"
          allowFullScreen={true}
        />
      </div>
    </>
  );
}
