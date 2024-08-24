import { useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./expertise.module.scss";
import Expertise from "@/components/Expertise";
import FiberManualRecordOutlined from "@mui/icons-material/FiberManualRecordOutlined";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import Belle33 from "@/assets/Belle-33.png";
import Belle34 from "@/assets/Belle-34.png";
import Belle31 from "@/assets/Belle-31.png";
import Belle38 from "@/assets/Belle-38.png";
import Belle29 from "@/assets/Belle-29.png";
import Belle30 from "@/assets/Belle-30.png";
import Belle32 from "@/assets/Belle-32.png";
import Belle36 from "@/assets/Belle-36.png";
import Belle35 from "@/assets/Belle-35.png";
import Belle37 from "@/assets/Belle-37.png";

export default function Expertises() {
  const { expertiseAreas, setExpertiseAreas } = useContext(StateContext);
  const { displayExpertise, setDisplayExpertise } = useContext(StateContext);

  useEffect(() => {
    expertiseAreas.map((item) => {
      item.title === displayExpertise
        ? (item.active = true)
        : (item.active = false);
    });
    setExpertiseAreas([...expertiseAreas]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <NextSeo
        title="خدمات کلینیک بل کلاس"
        description="کلینیک تخصصی زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      <div className={classes.information}>
        <h2>{displayExpertise}</h2>
        {displayExpertise === "فیلر" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle33} alt="logo" />
            </div>
            <p>
              فیلرهای پوستی مواد ژل مانندی هستند که برای بازگرداندن حجم از دست
              رفته، ایجاد خطوط صاف و نرم کردن چین و چروکها به زیر پوست تزریق
              میشوند. مدت زمان ماندگاری اثر فیلر های پوستی به محصول، ناحیه درمان
              و بیمار بستگی دارد. یکی از رایج ترین فیلرها، فیلرهای اسید
              هیالورونیک است. اسید هیالورونیک HA یک ماده طبیعی است که در پوست
              یافت میشود و به صاف و هیدراته شدن پوست کمک می کند. فیلرهای HA
              معمولا نرم و ژل مانند هستند و اثر آنها معمولا ۶ تا ۱۲ ماه باقی می
              ماند. در این مدت بدن به تدریج و به طور طبیعی ذرات را جذب میکند
            </p>
            <div className={classes.items}>
              <p className={classes.title}>موارد استفاده</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهش خطوط اطراف بینی و دهان</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>تقویت و بازگرداندن حجم به گونه های فرورفته یا شقیقه ها</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهــش خطـــوط عمودی لب و حجیم و تقویت کردن لبها</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهش چین چانه</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>ایجاد تقارن بین اجزای صورت</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>وجود تورم و کبودی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>تراوش فیلر از محل فیلر</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عفونت یا مقداری خراش برآمدگیهای کوچک اطراف تزریق</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>آسیب رساندن به عروق خونی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>انسداد برخی بافته</p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "نوتریژنومیکس" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle34} alt="logo" />
            </div>
            <p>
              ژنومیک تغذیه ای یا نوتریژنومیکس مطالعه تأثیرات مواد غذایی و
              ترکیبات غذا بر بیان ژن و چگونگی تأثیر تغییرات ژنتیکی بر محیط تغذیه
              است. این بر درک تعامل بین مواد مغذی و سایر فعال‌های زیستی رژیم
              غذایی با ژنوم در سطح مولکولی تمرکز دارد تا بفهمد چگونه مواد مغذی
              خاص یا رژیم‌های غذایی ممکن است بر سلامت انسان تأثیر بگذارد. ما در
              کلینیک بل کلاس با توجه به ژنوم شما، بهترین رژیم غذایی و برنامه
              ورزشی را به شما پیشنهاد می دهیم. پیشنهاداتی که به شما می شود بر
              اساس تمام یافته های علمی و منتشر شده توسط تیم متخصصین نوتریژنومیکس
              می باشد. این اطلاعات شامل موارد زیر است
            </p>
            <div className={classes.items}>
              <p className={classes.title}>موارد استفاده</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>متابولیسم مواد مغذی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عادات غذایی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>سلامت قلب</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  فیزیولوژیکی حرکات ورزشی، تناسب اندام، و خطر آسیب های ورزشی
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>اطلاعات ژنتیکی تکمیلی برای سلامت و تندرستی</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>
                چه چیزی ما را از بقیه مشاورین تغذیه متمایز می کند؟
              </p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  شرکت نوتریژنومیکس کانادا از شواهد علمی قوی استفاده می کند و
                  متخصصین تغذیه این حیطه را در دنیا هدایت می کند
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  نوتریژنومیکس ، تنها شرکت آزمایش های ژنتیکی می باشد که پروژه
                  های ژنتیک تغذیه ای را در دانشگاه های سراسر دنیا ساپورت مالی می
                  کند
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  مشاوره های نوتریژنومیکس بر اساس شواهد و اطلاعات ژنتیکی، شیوه
                  زندگی و شیوه تغذیه ای فرد است و از خطر ابتلا به بیماری های
                  نادر جلوگیری می کند
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  نوتریژنومیکس، ناشناس بودن همه نمونه ها را تضمین می کند و از
                  سخت ترین استانداردها برای انتقال امن داده ها و حفظ حریم خصوصی
                  استفاده می کند
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  نوتریژنومیکس اطمینان از نتایج درست را با داشتن آزمایشگاه های
                  دارای گواهینامه و با استفاده از استانداردهای کنترل کیفیت دقیق
                  متعهد می شود
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  مجموعه بل نماینده انحصاری شرکت نوتریژنومیکس کانادا در ایران
                  است
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "لیزر" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle31} alt="logo" />
            </div>
            <p>
              ​​​​​​​لیزر موهای زائد یک روش پزشکی است که از یک پرتو متمرکز نور
              (لیزر) برای از بین بردن موهای زائد استفاده می کند. در طی این
              فرایند، لیزر نوری از خود ساطع می کند که توسط رنگدانه (ملانین)
              موجود در مو جذب می شود. انرژی نور به گرما تبدیل می شود که به
              فولیکول ها آسیب می رساند. این آسیب رشد مو در آینده را مهار یا به
              تاخیر می اندازد. اگرچه لیزر موهای زائد به طور موثر رشد مو را برای
              دوره های طولانی به تاخیر می اندازد، اما معمولا منجر به حذف دائمی
              موهای زائد نمی شود. لیزر موهای زائد برای پلک ها، ابروها یا نواحی
              اطراف به دلیل احتمال آسیب شدید چشم توصیه نمی شود. در این روش، موها
              فوراً نمی ریزند و در طی چند روز تا چند هفته اتفاق می افتد.
              درمان‌های مکرر معمولاً ضروری است، زیرا رشد و ریزش مو به طور طبیعی
              در یک چرخه اتفاق می‌افتد و لیزر درمانی با فولیکول‌های مو در مرحله
              اولیه رشد بهترین اثرگذاری را دارد
            </p>
            <div className={classes.items}>
              <p className={classes.title}>رعایت نکات قبل از انجام لیز</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  پرهیز از داروهای رقیق کننده خون مانند آسپرین یا داروهای ضد
                  التهابی
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>اصلاح ناحیه درمان یک روز قبل از لیزر توصیه می شود</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>رعایت نکات بعد از انجام لیزر</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>دور ماندن از آفتاب</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  اجتناب از سایر روش های حذف موهای زائد مانند کندن، اپیلاسیون و
                  الکترولیز
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عدم استفاده از کرم های برنزه کننده</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  تحریک پوست، ناراحتی موقت، قرمزی و تورم پس از لیزر موهای زائد
                  ممکن است رخ دهد. هر گونه علائم و نشانه ای معمولا در عرض چند
                  ساعت ناپدید می شوند. برای کاهش هر گونه ناراحتی، یخ را روی
                  ناحیه تحت درمان قرار دهید
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  به ندرت لیزر موهای زائد می تواند باعث ایجاد تاول، پوسته پوسته
                  شدن، زخم یا سایر تغییرات در بافت پوست شود
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  سایر عوارض جانبی نادر عبارتند از سفید شدن موهای درمان شده یا
                  رشد بیش از حد مو در اطراف مناطق تحت درمان، به ویژه در پوست های
                  تیره تر
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "کاشت مو و ابرو" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle38} alt="logo" />
            </div>
            <p>
              در شایع ترین نوع ریزش موی دائمی، فقط قسمت بالای سر تحت تاثیر قرار
              می گیرد. کاشت مو یا جراحی کاشت مو می تواند از موهایی که باقی مانده
              است نهایت استفاده را ببرد. در طی عمل کاشت مو، یک متخصص پوست یا
              جراح زیبایی مو را از قسمتی از سر که دارای مو است برمی دارد و آن را
              به یک نقطه طاسی پیوند می دهد. هر تکه مو یک تا چند تار مو دارد
              (میکروگرافت و مینی گرافت). گاهی اوقات یک نوار بزرگتر از پوست حاوی
              چندین گروه مو گرفته می شود. این روش نیازی به بستری شدن در
              بیمارستان ندارد، اما دردناک است، بنابراین برای کاهش هر گونه
              ناراحتی به شما داروی آرامبخش داده می شود. خطرات احتمالی شامل
              خونریزی، کبودی، تورم و عفونت است. ممکن است برای رسیدن به اثر مورد
              نظر به بیش از یک عمل جراحی نیاز داشته باشید. ریزش موی ارثی با وجود
              جراحی در نهایت پیشرفت خواهد کرد
            </p>
          </Fragment>
        )}
        {displayExpertise === "بوتاکس" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle29} alt="logo" />
            </div>
            <p>
              سم بوتولینوم که با نام تجاری بوتاکس شناخته شده است از سم باکتری
              کلستریدیوم تهیه و برای فلج موقت عضلات استفاده می شود. تزریق بوتاکس
              در درجه اول به دلیل کاهش چین و چروک های صورت مورد توجه قرار گرفت.
              بوتاکس در موارد دیگری مورد استفاده قرار می گیرد. درمان اسپاسم گردن
              (دیستونی گردن)، تعریق بیش از حد (هیپرهیدروزیس)، مثانه بیش فعال و
              تنبلی چشم از جمله‌ی این موارد است. تزریق بوتاکس همچنین ممکن است به
              پیشگیری از میگرن مزمن کمک کند. تزریق بوتاکس معمولاً یک تا سه روز
              پس از درمان تاثیر خود را نشان می دهد. بسته به مشکلی که بوتاکس برای
              آن استفاده می شود، اثر آن می تواند تا سه ماه یا بیشتر از سه ماه
              باقی بماند
            </p>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عدم نیاز به بستری شدن</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>روشی غیرتهاجمی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>هزینه کمتر نسبت به جراحی های زیبایی</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عدم وجود دوره ی نقاهت</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>درد بسیار کم</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>راحتی بیمار پس از انجام تزریق بوتاکس</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>مشاهده ی سریع نتیجه</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>درد، تورم یا کبودی در محل تزریق</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>سردرد یا علائم شبیه آنفولانزا</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>افتادگی پلک یا ابروهای درهم رفته</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>لبخند کج یا ریزش آب دهان</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>خشکی چشم یا ریزش اشک زیاد</p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "پلاسمای غنی از پلاکت" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle30} alt="logo" />
            </div>
            <p>
              پلاسمای غنی از پلاکت به عنوان یک درمان احتمالی برای ریزش مو مورد
              استفاده قرار می گیرد. همچنین ممکن است بهبود زخم را تسریع کند.
              تعدادی از متخصصان پوست از پلاسمای غنی از پلاکت برای ایجاد پوستی
              جوان تر برای بیماران استفاده می کنند. ۵ میل خون از بازو بیمار
              گرفته شده، لایه حاوی پلاکت به وسیله دستگاه سانتریفیوژ جدا می شود.
              متخصص پوست، خونی را که حاوی غلظت بالایی از پلاکت ها است، با
              استفاده از یک سرنگ به صورت یا پوست سر تزریق می کند. برای افزایش
              اثرگذاری، متخصص پوست ممکن است فیلر را نیز به همراه پلاسمای غنی از
              پلاکت تزریق کند. اثرات کامل در عرض چند هفته تا چند ماه ظاهر می شود
              و می تواند تا ۱۸ ماه دوام داشته باشد
            </p>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهش چین و چروک</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>حجیم کردن پوست افتاده</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهش اسکارهای آکنه</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  ممکن است بیمار پس از اجرا کمی درد، کبودی و تورم را تجربه کند.
                  این عوارض در عرض چند روز از بین می روند
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "درمان با فرکانس رادویی" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle32} alt="logo" />
            </div>
            <p>
              درمان با فرکانس رادیویی یک روش غیرجراحی برای سفت کردن پوست است.
              امواج رادیویی نوعی تابش است که از آزاد شدن انرژی به شکل امواج
              الکترومغناطیسی ایجاد می شود. بسته به میزان انرژی آزاد شده می توان
              امواج را به عنوان کم انرژی یا پر انرژی طبقه بندی کرد. پرتوهای ایکس
              و گاما نمونه هایی از تابش پر انرژی هستند در حالی که امواج رادیویی
              کم انرژی در نظر گرفته می شوند. امواج رادیویی باعث گرم کردن (۵۰ تا
              ۷۵ درجه سانتیگراد) لایه عمیق پوست به نام درم شده که باعث تحریک
              تولید کلاژن می شود. کلاژن رایج ترین پروتئین در بدن انسان است.
              چارچوب پوست را ایجاد می کند و به پوست استحکام می بخشد. با افزایش
              سن، سلول ها کلاژن کمتری تولید می کنند که منجر به افتادگی پوست و
              چین و چروک می شود
            </p>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>سفت کردن پوست و خلاص شدن از شر چین و چروک</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>مبارزه با آسیب خورشید با تحریک تولید کلاژن</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>غیر تهاجمی، بدون درد</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  تنها عارضه جانبی مشاهده شده قرمزی خفیف است که بعد از چند ساعت
                  برطرف می شود
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "هایفوتراپی" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle36} alt="logo" />
            </div>
            <p>
              در هایفوتراپی از امواج فراصوت برای ایجاد حرارت در سطح عمیقی از
              پوست استفاده می‌شود. این حرارت سلول ­های پوستی تحریک و بدن را
              وادار می­ کند تا آن را ترمیم کند. برای انجام این کار، بدن برای رشد
              دوباره سلول­ها، کُلاژِن تولید می­ کند. کُلاژِن به پوست ساختاری سفت
              و کش‌سان می­ دهد. نتایج می ­توانند بلافاصله بعد از درمان دیده
              شوند، ولی مشاهده بیشتر نتایج تقریباً ۲ تا ۸ هفته بعد از درمان شروع
              می شوند، و بیشتر بیماران نتایج کامل را ۱۲ هفته پس از انجام درمان
              می بینند
            </p>
            <div className={classes.items}>
              <p className={classes.title}>موارد استفاده</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کشیده شدن پوست گردن</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کاهش حجم غبغب</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>از بین بردن افتادگی پلک ­ها یا لیفت افتادگی ابرو</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>از بین بردن چین و چروک ­های ظریف بر روی صورت</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کشیدگی پوست سینه</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عدم نیاز بیمار به آماده سازی قبل از انجام فرایند</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>عدم وجود دوران نقاهت</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>از بین بردن چربی‌های موضعی، لاغری و کانتورینگ بدن</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  متورم شدن و باد کردن پوست یکی از عوارض جانبی نادر هایفوتراپی
                  صورت است
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  تیره شدن پوست یکی از عوارض نادر و در عین حال محتمل هایفوتراپی
                  است که می‌تواند دائمی باشد
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "کرایوتراپی" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle37} alt="logo" />
            </div>
            <p>
              روش درمانی کرایوتراپی، استفاده از سرمای شدید برای انجماد و برداشتن
              بافت های غیر طبیعی است. پزشکان از آن برای درمان بسیاری از
              بیماری‌های پوستی (از جمله زگیل و برچسب‌های پوستی) و برخی سرطان‌ها
              از جمله سرطان پروستات، دهانه رحم و کبد استفاده می‌کنند. برای ایجاد
              این سرمای شدید، پزشک از نیتروژن مایع استفاده می کند. در طول
              کرایوتراپی، پزشک، سرمای شدید را روی بافت‌های غیرطبیعی اعمال
              می‌کند. سلول ها نمی توانند در این سرمای شدید و پس از درمان زنده
              بمانند
            </p>
            <div className={classes.items}>
              <p className={classes.title}>موارد استفاده</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>بیماری های پوستی مانند زگیل و لکه های تیره</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  بیماری های پوستی پیش سرطانی و سرطان های پوست در مراحل اولیه،
                  از جمله کارسینوم سلول سنگفرشی و کارسینوم سلول بازال
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>سرطان استخوان</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>سرطان دهانه رحم، سرطان کبد و سرطان پروستات</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>رتینوبلاستوما (سرطان شبکیه در کودکان)</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کرایوتراپی یک روش درمانی کم تهاجمی است</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>کرایوتراپی معمولاً بدون جراحی باز انجام می شود</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>در این روش، بهبود سریع و با درد کم است</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  خطرات کرایوتراپی اندک است، اما ممکن است عوارضی ایجاد شود. این
                  عوارض ممکن است: تورم، جای زخم و عفونت پوست باشد. ناحیه تحت
                  درمان بعد از درمان قرمز می شود و احتمالاً تاول می زند. هر درد
                  خفیفی بعد از حدود سه روز از بین می رود. ناحیه تحت درمان یک
                  دلمه تشکیل می دهد که معمولاً در عرض یک تا سه هفته بهبود می
                  یابد
                </p>
              </div>
            </div>
          </Fragment>
        )}
        {displayExpertise === "لیفت با نخ" && (
          <Fragment>
            <div className={classes.image}>
              <Image width={250} height={250} src={Belle35} alt="logo" />
            </div>
            <p>
              لیفت با نخ نوعی روش است که در آن از بخیه های موقت برای ایجاد یک
              لیفت ظریف اما قابل مشاهده در پوست استفاده می شود. این روش جایگزین
              جراحی پوست شل شده صورت بیمار می باشد که باعث می شود که پوست کمی به
              عقب کشیده شود و در نتیجه صورت را لیفت و سفت می کند. نخ‌ها علاوه بر
              ایده‌آل بودن برای لیفت پوست، با تحریک سلول ها و وادارکردن آنها به
              تولید و هدایت کلاژن به مناطق تحت درمان، با پیری مبارزه می‌کنند.
              ماندگاری لیفت با نخ به طور کلی بین یک تا سه سال است
            </p>
            <div className={classes.items}>
              <p className={classes.title}>موارد استفاده</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>افراد ۳۰ تا ۵۰ سال</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  مناسب برای افراد مسنی که قادر به انجام عمل جراحی لیفت صورت
                  نیستند، (مانند افرادی که فشار خون بالا، دیابت نوع دو و بیماری
                  قلبی عروقی دارند)
                </p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>مزایا</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>پروسیژر را می توان با بیهوشی موضعی انجام داد</p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  افراد تحت درمان می توانند سریع به روال عادی زنگی خود برگردند
                </p>
              </div>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p> غیرتهاجمی و کم خطر است</p>
              </div>
            </div>
            <div className={classes.items}>
              <p className={classes.title}>عوارض</p>
              <div className={classes.row}>
                <FiberManualRecordOutlined
                  className={classes.icon}
                  sx={{ fontSize: 8 }}
                />
                <p>
                  عوارض جانبی مانند زخم، کبودی و خونریزی شدید ندارد. در موارد
                  نادر، بیماران ممکن است دچار سوزش، عفونت یا نمایان شدن بخیه های
                  آنها در زیر پوست خود شوند. با این حال، اگر این اتفاق بیفتد،
                  بخیه ها را می توان به سادگی برداشت و صورت بیمار به حالت قبلی
                  خود باز خواهد گشت
                </p>
              </div>
            </div>
          </Fragment>
        )}
      </div>
      <Expertise></Expertise>
    </div>
  );
}
