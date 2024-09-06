import classes from "./home.module.scss";

export default function NotFoundPage() {
  return (
    <div className={classes.notFound}>
      <h2>صفحه یافت نشد</h2>
      <p>صفحه مورد نظر وجود ندارد</p>
    </div>
  );
}
