import { useContext, Fragment, useEffect, useRef, useState } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./method.module.scss";
import logo from "@/assets/logo.png";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { applyFontToEnglishWords } from "@/services/utility";

const methodTypes = [
  {
    item: {
      fa: "تزریق شقیقه",
      en: "all",
    },
  },
  {
    item: {
      fa: "تزریق میدفیس",
      en: "fillers",
    },
  },
  {
    item: {
      fa: "اصلاح خط خنده و خط غم",
      en: "botox",
    },
  },
  {
    item: {
      fa: "اصلاح چانه و زاویه فک",
      en: "mesotherapy",
    },
  },
  {
    item: {
      fa: "جوان‌ سازی",
      en: "skin rejuvenation",
    },
  },
  {
    item: {
      fa: "لیفت صورت با نخ",
      en: "PRP",
    },
  },
  {
    item: {
      fa: "لیفت نان‌سرجیکال",
      en: "enzyme",
    },
  },
  {
    item: {
      fa: "لیزر فرکشنال CO₂",
      en: "ultrasound",
    },
  },
  {
    item: {
      fa: "لیزر Helios III Q-Switched",
      en: "surgical laser",
    },
  },
];

export default function Method() {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const [selectTopic, setSelectTopic] = useState("تزریق شقیقه");

  const targetBox = useRef(null);

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const texts = {
    "تزریق شقیقه": [
      {
        fa: "نقش شقیقه در زیبایی چهره",
        en: "The Role of the Temple in Facial Beauty",
      },
      {
        fa: "شقیقه شاید در نگاه اول یکی از اجزای اصلی صورت به نظر نرسد، اما نقش مهمی در فرم کلی و پیوستگی کانتور چهره دارد.",
        en: "At first glance, the temple may not seem like one of the main components of the face, but it plays an important role in the overall shape and continuity of the facial contour.",
      },
      {
        fa: "در یک چهره متعادل، حرکت خطوط از پیشانی به شقیقه و سپس به استخوان گونه، نرم و پیوسته است. کاهش حجم در این ناحیه می‌تواند این پیوستگی را از بین ببرد و باعث شود قسمت فوقانی صورت استخوانی‌تر، خسته‌تر یا مسن‌تر دیده شود.",
        en: "In a balanced face, the flow of lines from the forehead to the temple and then to the cheekbone is smooth and continuous. Volume loss in this area can break this continuity, making the upper part of the face appear bonier, more tired, or older.",
      },
      {
        fa: "با افزایش سن، تغییرات استخوانی و کاهش یا جابه‌جایی حجم بافت نرم می‌توانند باعث ایجاد گودی در ناحیه شقیقه شوند. این تغییر گاهی به‌تنهایی چندان واضح نیست، اما می‌تواند بر برداشت ما از کل چهره تأثیر قابل‌توجهی داشته باشد.",
        en: "With aging, bony changes and the reduction or displacement of soft tissue volume can cause hollowing in the temple area. This change is sometimes not very noticeable on its own, but it can significantly affect our perception of the entire face.",
      },
      {
        fa: "تزریق شقیقه فقط برای پر کردن گودی نیست",
        en: "Temple Injection Is Not Just About Filling Hollows",
      },
      {
        fa: "یکی از اشتباهات رایج در اصلاح شقیقه، نگاه کردن به آن به‌عنوان یک فضای خالی است که باید کاملاً پر شود.",
        en: "One common mistake in temple correction is viewing it as an empty space that must be completely filled.",
      },
      {
        fa: "هدف یک تزریق صحیح لزوماً حذف کامل گودی شقیقه نیست.",
        en: "The goal of a proper injection is not necessarily to completely eliminate temple hollowing.",
      },
      {
        fa: "مقداری از Concavity در این ناحیه می‌تواند بخشی از آناتومی طبیعی و زیبای صورت باشد. اصلاح بیش از حد ممکن است مرز طبیعی پیشانی، شقیقه و گونه را از بین ببرد و قسمت فوقانی صورت را بیش از اندازه گرد یا سنگین نشان دهد.",
        en: "A certain degree of concavity in this area can be part of the face's natural and attractive anatomy. Over-correction may erase the natural boundary between the forehead, temple, and cheek, making the upper face look overly round or heavy.",
      },
      {
        fa: "در متد Outline، میزان اصلاح بر اساس ساختار استخوانی، فرم پیشانی، موقعیت ابرو، برجستگی استخوان گونه و نسبت شقیقه با سایر اجزای صورت تعیین می‌شود.",
        en: "In the Outline method, the degree of correction is determined based on bone structure, forehead shape, eyebrow position, cheekbone prominence, and the temple's proportion relative to other facial features.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "پیش از تزریق، شقیقه به‌صورت یک ناحیه مستقل ارزیابی نمی‌شود.",
        en: "Before injection, the temple is not assessed as an isolated area.",
      },
      {
        fa: "ما به ارتباط آن با پیشانی، ابرو، قوس زیگوماتیک و Midface نگاه می‌کنیم و مشخص می‌کنیم که چه میزان اصلاح می‌تواند بیشترین تأثیر را بر هارمونی کلی چهره داشته باشد.",
        en: "We look at its relationship with the forehead, eyebrow, zygomatic arch, and midface, and determine how much correction can have the greatest impact on the overall harmony of the face.",
      },
      {
        fa: "بر اساس آناتومی و نیاز هر چهره، پزشک می‌تواند پلن درمان، محصول و تکنیک مناسب را انتخاب کند.",
        en: "Based on the anatomy and needs of each face, the physician can select the appropriate treatment plan, product, and technique.",
      },
      {
        fa: "هدف، ایجاد حجم بیشتر نیست؛ هدف، ایجاد حجم در نقطه درست و به اندازه درست است.",
        en: "The goal is not to create more volume; the goal is to create volume at the right point and in the right amount.",
      },
      {
        fa: "نتیجه‌ای که به دنبال آن هستیم",
        en: "The Result We Are Aiming For",
      },
      {
        fa: "یک تزریق موفق شقیقه نباید در نگاه اول قابل تشخیص باشد.",
        en: "A successful temple injection should not be noticeable at first glance.",
      },
      {
        fa: "صورت نباید «پر شده» به نظر برسد. در عوض، کانتور قسمت فوقانی صورت نرم‌تر می‌شود، ارتباط میان پیشانی و گونه طبیعی‌تر به نظر می‌رسد و چهره می‌تواند بدون تغییر هویت اصلی خود، متعادل‌تر و جوان‌تر دیده شود.",
        en: 'The face should not look "filled." Instead, the contour of the upper face becomes softer, the connection between the forehead and cheek appears more natural, and the face can look more balanced and youthful without losing its core identity.',
      },
      {
        fa: "در Outline، یک تزریق خوب الزاماً دیده نمی‌شود؛ اثر آن در تناسب کلی چهره دیده می‌شود.",
        en: "In Outline, a good injection is not necessarily seen; its effect is seen in the overall proportion of the face.",
      },
    ],
    "تزریق میدفیس": [
      {
        fa: "میدفیس؛ مرکز تعادل چهره",
        en: "Midface: The Center of Facial Balance",
      },
      {
        fa: "Midface یا بخش میانی صورت، یکی از مهم‌ترین نواحی در معماری چهره است.",
        en: "The midface, or the middle part of the face, is one of the most important areas in facial architecture.",
      },
      {
        fa: "استخوان گونه، بافت‌های عمقی و سطحی، لیگامان‌ها و ساختارهای اطراف چشم در کنار یکدیگر فرم این ناحیه را می‌سازند. به همین دلیل، تغییرات Midface فقط ظاهر گونه را تغییر نمی‌دهند؛ بلکه می‌توانند بر نحوه دیده شدن زیر چشم، خط خنده و حتی تعادل کلی صورت تأثیر بگذارند.",
        en: "The cheekbone, deep and superficial tissues, ligaments, and structures around the eye together shape this area. For this reason, changes in the midface do not only alter the appearance of the cheek; they can also affect how the under-eye area, the smile line, and even the overall balance of the face are perceived.",
      },
      {
        fa: "در یک چهره جوان و متعادل، Midface دارای Projection و Support مناسب است و انتقال میان پلک پایین، گونه و قسمت مرکزی صورت به شکل طبیعی و پیوسته دیده می‌شود.",
        en: "In a youthful, balanced face, the midface has proper projection and support, and the transition between the lower eyelid, cheek, and central part of the face appears natural and continuous.",
      },
      {
        fa: "با افزایش سن چه اتفاقی می‌افتد؟",
        en: "What Happens With Aging?",
      },
      {
        fa: "افزایش سن فقط به معنی از دست رفتن حجم نیست.",
        en: "Aging does not simply mean the loss of volume.",
      },
      {
        fa: "تغییرات تدریجی در ساختار استخوان، کمپارتمان‌های چربی، لیگامان‌ها و کیفیت پوست باعث می‌شوند توزیع و ساپورت بافت‌های صورت تغییر کند.",
        en: "Gradual changes in bone structure, fat compartments, ligaments, and skin quality cause the distribution and support of facial tissues to change.",
      },
      {
        fa: "نتیجه ممکن است به شکل صاف‌تر شدن یا کاهش برجستگی گونه، مشخص‌تر شدن ناحیه زیر چشم، عمیق‌تر شدن خط خنده یا ایجاد ظاهر خسته در قسمت مرکزی صورت دیده شود.",
        en: "The result may appear as a flatter or less prominent cheek, a more pronounced under-eye area, a deepened smile line, or a tired appearance in the central part of the face.",
      },
      {
        fa: "به همین دلیل، همیشه نمی‌توان این تغییرات را تنها با «اضافه کردن حجم» اصلاح کرد.",
        en: 'For this reason, these changes cannot always be corrected simply by "adding volume."',
      },
      {
        fa: "تزریق میدفیس با گونه‌سازی یکسان نیست",
        en: "Midface Injection Is Not the Same as Cheek Augmentation",
      },
      {
        fa: "یکی از اصول مهم در متد Outline، تفکیک میان Volume و Structure است.",
        en: "One of the important principles of the Outline method is distinguishing between volume and structure.",
      },
      {
        fa: "در برخی چهره‌ها هدف می‌تواند افزایش Projection یا تعریف بهتر استخوان گونه باشد؛ اما در برخی دیگر، مقدار کمی تزریق در نقاط استراتژیک برای ایجاد Support و بازگرداندن تناسب کافی است.",
        en: "In some faces, the goal may be to increase projection or better define the cheekbone; in others, a small amount of injection at strategic points is enough to create support and restore proportion.",
      },
      {
        fa: "تزریق بیش از اندازه در Midface می‌تواند چهره را سنگین، گرد یا غیرطبیعی نشان دهد و حتی تناسب سایر اجزای صورت را تغییر دهد.",
        en: "Over-injecting the midface can make the face look heavy, round, or unnatural, and can even alter the proportion of other facial features.",
      },
      {
        fa: "بنابراین سؤال اصلی این نیست که:",
        en: "So the main question is not:",
      },
      {
        fa: "«چه مقدار فیلر گونه نیاز داریم؟»",
        en: '"How much cheek filler do we need?"',
      },
      {
        fa: "بلکه این است که:",
        en: "But rather:",
      },
      {
        fa: "«کدام بخش از ساختار Midface نیاز به اصلاح دارد؟»",
        en: '"Which part of the midface structure needs correction?"',
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "در متد Outline، پیش از تزریق Midface، ساختار کل صورت ارزیابی می‌شود.",
        en: "In the Outline method, before midface injection, the structure of the entire face is evaluated.",
      },
      {
        fa: "Projection گونه، قوس زیگوماتیک، ناحیه زیر چشم، خط خنده، شقیقه و نسبت قسمت میانی صورت با چانه و فک، همگی بخشی از این ارزیابی هستند.",
        en: "Cheek projection, the zygomatic arch, the under-eye area, the smile line, the temple, and the proportion of the midface to the chin and jaw are all part of this evaluation.",
      },
      {
        fa: "سپس بر اساس آناتومی و ویژگی‌های هر چهره، نقاطی انتخاب می‌شوند که اصلاح آن‌ها بتواند با کمترین تغییر غیرضروری، بیشترین تأثیر را بر تناسب صورت ایجاد کند.",
        en: "Then, based on the anatomy and characteristics of each face, points are selected whose correction can create the greatest impact on facial proportion with the least unnecessary change.",
      },
      {
        fa: "در بعضی افراد این به معنی ایجاد Projection بیشتر است؛ در بعضی دیگر ایجاد Support و در گروهی تنها بازتعریف ظریف کانتور طبیعی صورت.",
        en: "For some individuals, this means creating more projection; for others, creating support; and for another group, only a subtle redefinition of the face's natural contour.",
      },
      {
        fa: "یک نسخه ثابت برای تمام چهره‌ها وجود ندارد.",
        en: "There is no fixed formula for all faces.",
      },
      {
        fa: "هدف نهایی",
        en: "The Ultimate Goal",
      },
      {
        fa: "هدف تزریق Midface در Outline ساختن یک گونه جدید نیست.",
        en: "The goal of midface injection in Outline is not to create a new cheek.",
      },
      {
        fa: "هدف این است که قسمت میانی صورت دوباره با سایر اجزای چهره ارتباط متعادل‌تری پیدا کند؛ بدون اینکه فرد ویژگی‌هایی را که او را قابل‌شناسایی می‌کنند از دست بدهد.",
        en: "The goal is for the midface to regain a more balanced relationship with the other features of the face, without the person losing the characteristics that make them recognizable.",
      },
      {
        fa: "گاهی چند تغییر کوچک و دقیق می‌توانند بیشتر از حجم زیاد، چهره را جوان‌تر و متعادل‌تر نشان دهند.",
        en: "Sometimes a few small, precise changes can make the face look younger and more balanced more effectively than a large volume of filler.",
      },
      {
        fa: "در Outline، ابتدا ساختار را می‌بینیم؛ سپس درباره حجم تصمیم می‌گیریم.",
        en: "In Outline, we look at the structure first; then we decide about volume.",
      },
    ],
    "اصلاح خط خنده و خط غم": [
      {
        fa: "هر خطی نیاز به تزریق مستقیم ندارد",
        en: "Not Every Line Needs Direct Injection",
      },
      {
        fa: "خط خنده و خط غم از شایع‌ترین تغییراتی هستند که با افزایش سن در قسمت مرکزی و پایینی صورت دیده می‌شوند.",
        en: "The smile line (nasolabial fold) and marionette lines are among the most common changes seen in the central and lower parts of the face with aging.",
      },
      {
        fa: "اما در متد Outline، مشاهده یک خط به معنی تزریق مستقیم همان ناحیه نیست.",
        en: "However, in the Outline method, observing a line does not mean that area itself must be directly injected.",
      },
      {
        fa: "صورت یک ساختار به‌هم‌پیوسته است و آنچه به شکل یک خط یا فرورفتگی دیده می‌شود، ممکن است نتیجه تغییراتی باشد که در ناحیه‌ای دیگر اتفاق افتاده‌اند.",
        en: "The face is an interconnected structure, and what appears as a line or hollow may actually result from changes that occurred in a different area.",
      },
      {
        fa: "به همین دلیل، قبل از تصمیم برای تزریق باید ابتدا مشخص شود:",
        en: "For this reason, before deciding on injection, it must first be determined:",
      },
      {
        fa: "چرا این خط ایجاد شده است؟",
        en: "Why has this line formed?",
      },
      {
        fa: "خط خنده",
        en: "The Smile Line",
      },
      {
        fa: "Nasolabial Fold یا خط خنده، بخشی طبیعی از آناتومی صورت است و حتی در چهره‌های جوان نیز وجود دارد.",
        en: "The nasolabial fold, or smile line, is a natural part of facial anatomy and exists even in youthful faces.",
      },
      {
        fa: "با افزایش سن، تغییر در ساختار Midface، جابه‌جایی بافت‌های نرم و کاهش Support می‌تواند باعث عمیق‌تر دیده شدن این خط شود.",
        en: "With aging, changes in midface structure, displacement of soft tissue, and reduced support can cause this line to appear deeper.",
      },
      {
        fa: "بنابراین هدف همیشه حذف کامل خط خنده نیست.",
        en: "Therefore, the goal is not always to completely eliminate the smile line.",
      },
      {
        fa: "در بعضی چهره‌ها، اصلاح بخشی از Midface می‌تواند بدون تزریق زیاد در خود خط خنده، ظاهر آن را متعادل‌تر کند. در برخی دیگر، تزریق مستقیم و کنترل‌شده نیز می‌تواند بخشی از پلن درمان باشد.",
        en: "In some faces, correcting part of the midface can make the line's appearance more balanced without injecting much into the line itself. In others, direct, controlled injection can also be part of the treatment plan.",
      },
      {
        fa: "هدف، کاهش شدت خط بدون حذف آناتومی طبیعی صورت است.",
        en: "The goal is to reduce the severity of the line without erasing the face's natural anatomy.",
      },
      {
        fa: "خط غم",
        en: "Marionette Lines",
      },
      {
        fa: "Marionette Lines یا خطوطی که از گوشه‌های دهان به سمت پایین امتداد پیدا می‌کنند، می‌توانند حالت چهره را خسته‌تر یا غمگین‌تر نشان دهند.",
        en: "Marionette lines, which extend downward from the corners of the mouth, can make the face appear more tired or sadder.",
      },
      {
        fa: "اما این خطوط نیز تنها یک فرورفتگی ساده نیستند.",
        en: "But these lines, too, are not simply a plain hollow.",
      },
      {
        fa: "ساختار چانه، کاهش Support در قسمت پایینی صورت، تغییرات بافت نرم و حرکت عضلات اطراف دهان همگی می‌توانند در شکل‌گیری آن‌ها نقش داشته باشند.",
        en: "Chin structure, reduced support in the lower face, soft tissue changes, and the movement of muscles around the mouth can all play a role in their formation.",
      },
      {
        fa: "به همین دلیل، اصلاح این ناحیه ممکن است ترکیبی از درمان چند نقطه مختلف باشد، نه صرفاً تزریق داخل خط.",
        en: "For this reason, correcting this area may involve a combination of treatments at several different points, not simply injecting into the line itself.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "در Outline، ابتدا Midface، اطراف دهان، چانه و Jawline در کنار یکدیگر بررسی می‌شوند.",
        en: "In Outline, the midface, perioral area, chin, and jawline are first examined together.",
      },
      {
        fa: "سپس مشخص می‌شود چه بخشی از مشکل مربوط به کاهش Support، چه بخشی مربوط به Volume Loss و چه بخشی نتیجه تغییرات طبیعی بافت و حرکت صورت است.",
        en: "It is then determined which part of the issue relates to reduced support, which part relates to volume loss, and which part results from natural tissue changes and facial movement.",
      },
      {
        fa: "بر اساس این ارزیابی، ممکن است درمان شامل اصلاح ساختارهای اطراف، تزریق محدود داخل خود خط یا ترکیبی از چند تکنیک باشد.",
        en: "Based on this assessment, treatment may involve correcting the surrounding structures, limited injection directly into the line, or a combination of several techniques.",
      },
      {
        fa: "اصل مهم این است:",
        en: "The important principle is this:",
      },
      {
        fa: "ما خط را درمان نمی‌کنیم؛ چهره‌ای را که آن خط در آن شکل گرفته است ارزیابی می‌کنیم.",
        en: "We do not treat the line; we assess the face in which that line has formed.",
      },
      {
        fa: "حفظ حرکت و حالت طبیعی صورت",
        en: "Preserving Natural Facial Movement and Expression",
      },
      {
        fa: "خطوط صورت بخشی از Expression و هویت چهره هستند.",
        en: "Facial lines are part of a person's expression and facial identity.",
      },
      {
        fa: "هدف درمان در Outline رسیدن به صورتی کاملاً بدون خط نیست؛ بلکه کاهش تغییراتی است که باعث می‌شوند چهره بیش از سن واقعی خسته، سنگین یا افتاده به نظر برسد.",
        en: "The goal of treatment in Outline is not to achieve a completely line-free face; rather, it is to reduce the changes that make the face appear more tired, heavy, or sagging than its actual age.",
      },
      {
        fa: "نتیجه مطلوب باید هنگام استراحت و هنگام لبخند طبیعی باقی بماند.",
        en: "The desired result should remain natural both at rest and while smiling.",
      },
      {
        fa: "گاهی بهترین راه برای اصلاح یک خط، تزریق نکردن همان خط است.",
        en: "Sometimes the best way to correct a line is not to inject that line at all.",
      },
    ],
    "اصلاح چانه و زاویه فک": [
      {
        fa: "Profile & Proportion",
        en: "Profile & Proportion",
      },
      {
        fa: "زیبایی چانه و خط فک را نمی‌توان مستقل از سایر اجزای صورت ارزیابی کرد.",
        en: "The beauty of the chin and jawline cannot be evaluated independently of the other facial features.",
      },
      {
        fa: "موقعیت چانه، طول و عرض آن، فرم فک و ارتباط این ساختارها با لب‌ها، بینی و Midface، نقش مهمی در تناسب کلی چهره دارند.",
        en: "The position of the chin, its length and width, the shape of the jaw, and the relationship of these structures with the lips, nose, and midface all play an important role in the overall proportion of the face.",
      },
      {
        fa: "گاهی یک تغییر کوچک در Projection یا فرم چانه می‌تواند بدون ایجاد تغییر قابل‌توجه در سایر قسمت‌ها، تعادل کل صورت را متفاوت نشان دهد.",
        en: "Sometimes a small change in the projection or shape of the chin can make the balance of the entire face look different, without causing a noticeable change in other areas.",
      },
      {
        fa: "به همین دلیل، در متد Outline هدف صرفاً ساختن یک فک مشخص‌تر یا چانه برجسته‌تر نیست.",
        en: "For this reason, the goal of the Outline method is not simply to create a more defined jaw or a more prominent chin.",
      },
      {
        fa: "هدف، رسیدن به تناسب است.",
        en: "The goal is to achieve proportion.",
      },
      {
        fa: "چانه؛ نقطه‌ای کوچک با تأثیری بزرگ",
        en: "The Chin: A Small Point With a Big Impact",
      },
      {
        fa: "چانه یکی از عناصر اصلی در تعیین نسبت‌های صورت، به‌خصوص در نمای نیم‌رخ است.",
        en: "The chin is one of the main elements in determining facial proportions, especially in profile view.",
      },
      {
        fa: "Projection ناکافی، طول نامتناسب یا فرم نامناسب چانه می‌تواند بر نحوه دیده شدن لب‌ها، بینی، Jawline و حتی گردن تأثیر بگذارد.",
        en: "Insufficient projection, disproportionate length, or an unsuitable chin shape can affect how the lips, nose, jawline, and even the neck appear.",
      },
      {
        fa: "در مقابل، تزریق بیش از اندازه نیز می‌تواند تعادل طبیعی صورت را از بین ببرد.",
        en: "On the other hand, over-injection can also destroy the face's natural balance.",
      },
      {
        fa: "بنابراین طراحی چانه تنها به معنی تزریق در یک نقطه نیست.",
        en: "Therefore, designing the chin does not simply mean injecting at a single point.",
      },
      {
        fa: "پیش از درمان، طول صورت، Projection چانه، فرم لب‌ها، موقعیت بینی و نسبت میان قسمت‌های مختلف چهره در کنار یکدیگر بررسی می‌شوند.",
        en: "Before treatment, facial length, chin projection, lip shape, nose position, and the proportions among different parts of the face are all examined together.",
      },
      {
        fa: "Jawline؛ تعریف بهتر، نه الزاماً فک بزرگ‌تر",
        en: "Jawline: Better Definition, Not Necessarily a Bigger Jaw",
      },
      {
        fa: "یک Jawline زیبا الزاماً یک خط فک بسیار تیز و برجسته نیست.",
        en: "A beautiful jawline is not necessarily a very sharp and prominent jawline.",
      },
      {
        fa: "فرم مناسب فک به ساختار طبیعی صورت، جنسیت، عرض Midface، فرم چانه و ویژگی‌های فردی هر چهره بستگی دارد.",
        en: "The appropriate jaw shape depends on the face's natural structure, gender, midface width, chin shape, and the individual characteristics of each face.",
      },
      {
        fa: "در برخی افراد، تعریف ظریف مرز فک کافی است. در برخی دیگر، اصلاح زاویه فک یا چانه می‌تواند به ایجاد Continuity بهتر در Lower Face کمک کند.",
        en: "In some people, subtle definition of the jaw border is enough. In others, correcting the jaw angle or chin can help create better continuity in the lower face.",
      },
      {
        fa: "هدف این نیست که تمام صورت‌ها به یک فرم مشخص نزدیک شوند.",
        en: "The goal is not for all faces to move toward one specific shape.",
      },
      {
        fa: "زنانه یا مردانه؛ یک الگوی ثابت وجود ندارد",
        en: "Feminine or Masculine: There Is No Fixed Template",
      },
      {
        fa: "طراحی Lower Face باید با هویت کلی چهره هماهنگ باشد.",
        en: "The design of the lower face must be in harmony with the overall identity of the face.",
      },
      {
        fa: "در بعضی چهره‌ها، خطوط نرم‌تر و Transition ظریف‌تر می‌توانند جذاب‌تر باشند؛ در برخی دیگر، Projection و Definition بیشتر باعث ایجاد تناسب بهتر می‌شود.",
        en: "In some faces, softer lines and more subtle transitions can be more attractive; in others, greater projection and definition create better proportion.",
      },
      {
        fa: "حتی دو فرد با ساختار مشابه ممکن است به طراحی کاملاً متفاوتی نیاز داشته باشند.",
        en: "Even two individuals with similar structures may need completely different designs.",
      },
      {
        fa: "به همین دلیل، در Outline طراحی بر اساس یک قالب از پیش تعیین‌شده انجام نمی‌شود.",
        en: "For this reason, design in Outline is not carried out based on a predetermined template.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "در ارزیابی چانه و فک، صورت از روبه‌رو، نیم‌رخ و زوایای مختلف بررسی می‌شود.",
        en: "In evaluating the chin and jaw, the face is examined from the front, in profile, and from various angles.",
      },
      {
        fa: "نسبت میان Midface، لب‌ها، چانه و Jawline در کنار ساختار طبیعی استخوان و بافت نرم مشخص می‌کند که چه تغییری می‌تواند بیشترین تأثیر را بر هارمونی صورت داشته باشد.",
        en: "The proportion among the midface, lips, chin, and jawline, together with the natural bone and soft tissue structure, determines which change can have the greatest impact on facial harmony.",
      },
      {
        fa: "گاهی این تغییر شامل اصلاح چانه است، گاهی Jawline و گاهی برای رسیدن به نتیجه بهتر باید هر دو به‌عنوان یک واحد طراحی شوند.",
        en: "Sometimes this change involves correcting the chin, sometimes the jawline, and sometimes, to achieve a better result, both must be designed together as a single unit.",
      },
      {
        fa: "در نهایت، میزان تزریق اهمیت کمتری از محل و هدف تزریق دارد.",
        en: "Ultimately, the amount of injection is less important than its location and purpose.",
      },
      {
        fa: "نتیجه‌ای که به دنبال آن هستیم",
        en: "The Result We Are Aiming For",
      },
      {
        fa: "نتیجه مطلوب، فکی نیست که قبل از هر جزء دیگری در صورت دیده شود.",
        en: "The desired result is not a jaw that is noticed before any other feature of the face.",
      },
      {
        fa: "چانه و Jawline زمانی زیبا هستند که به جای جلب توجه به خود، باعث شوند کل صورت متناسب‌تر به نظر برسد.",
        en: "The chin and jawline are beautiful when, instead of drawing attention to themselves, they make the entire face look more proportionate.",
      },
      {
        fa: "در Outline، کانتور صورت طراحی می‌شود؛ نه اینکه صرفاً برجسته‌تر شود.",
        en: "In Outline, the contour of the face is designed; it is not simply made more prominent.",
      },
    ],
    "جوان‌ سازی": [
      {
        fa: "Regenerative Aesthetics",
        en: "Regenerative Aesthetics",
      },
      {
        fa: "جوان‌سازی پوست فقط به معنی افزایش رطوبت یا ایجاد درخشندگی موقت نیست.",
        en: "Skin rejuvenation does not simply mean increasing hydration or creating temporary radiance.",
      },
      {
        fa: "پوست یک بافت زنده و پویاست که کیفیت آن به عملکرد سلول‌ها و محیط اطراف آن‌ها وابسته است. با افزایش سن و تحت تأثیر عواملی مانند نور خورشید و استرس اکسیداتیو، تغییراتی در کلاژن، الاستین، ماتریکس خارج سلولی و عملکرد سلولی پوست ایجاد می‌شود.",
        en: "Skin is a living, dynamic tissue whose quality depends on cellular function and the environment surrounding those cells. With aging, and under the influence of factors such as sunlight and oxidative stress, changes occur in collagen, elastin, the extracellular matrix, and skin cell function.",
      },
      {
        fa: "نتیجه این تغییرات می‌تواند به شکل کاهش قوام و الاستیسیته، خطوط ظریف، خشکی، افت کیفیت بافت و کاهش شادابی پوست دیده شود.",
        en: "The result of these changes can appear as reduced firmness and elasticity, fine lines, dryness, decreased tissue quality, and loss of skin radiance.",
      },
      {
        fa: "در Outline، جوان‌سازی با یک سؤال آغاز می‌شود:",
        en: "In Outline, rejuvenation begins with one question:",
      },
      {
        fa: "پوست شما واقعاً به چه چیزی نیاز دارد؟",
        en: "What does your skin actually need?",
      },
      {
        fa: "یک محصول برای همه پوست‌ها وجود ندارد",
        en: "There Is No One Product for Every Skin",
      },
      {
        fa: "اصطلاح «جوان‌ساز» طیف وسیعی از محصولات با ترکیبات و مکانیسم‌های متفاوت را در بر می‌گیرد.",
        en: 'The term "rejuvenator" encompasses a wide range of products with different compositions and mechanisms.',
      },
      {
        fa: "برخی درمان‌ها بیشتر بر hydration و بهبود کیفیت پوست تمرکز دارند، برخی محیط خارج سلولی پوست را هدف قرار می‌دهند و برخی با ایجاد تحریک بیولوژیک، فرآیندهای مرتبط با بازسازی بافت و تولید کلاژن را تحت تأثیر قرار می‌دهند.",
        en: "Some treatments focus mainly on hydration and improving skin quality, some target the skin's extracellular environment, and others influence tissue-regeneration and collagen-production processes by creating biological stimulation.",
      },
      {
        fa: "به همین دلیل، Profhilo، Jalupro، PDRN و Lanluma چهار نام متفاوت برای یک درمان مشابه نیستند.",
        en: "For this reason, Profhilo, Jalupro, PDRN, and Lanluma are not four different names for the same treatment.",
      },
      {
        fa: "هرکدام می‌توانند جایگاه متفاوتی در یک برنامه جوان‌سازی داشته باشند.",
        en: "Each can have a different place within a rejuvenation program.",
      },
      {
        fa: "Profhilo",
        en: "Profhilo",
      },
      {
        fa: "Profhilo یک درمان مبتنی بر هیالورونیک اسید با غلظت بالا است که با هدف بهبود کیفیت پوست و Bio-remodeling طراحی شده است.",
        en: "Profhilo is a high-concentration hyaluronic-acid-based treatment designed to improve skin quality and promote bio-remodeling.",
      },
      {
        fa: "برخلاف فیلرهای معمول، هدف اصلی آن ایجاد حجم یا تغییر کانتور صورت نیست.",
        en: "Unlike conventional fillers, its main goal is not to create volume or change the facial contour.",
      },
      {
        fa: "Profhilo بیشتر زمانی مورد توجه قرار می‌گیرد که کاهش hydration، الاستیسیته و کیفیت عمومی پوست بخشی از مشکل باشد.",
        en: "Profhilo is more often considered when reduced hydration, elasticity, and overall skin quality are part of the problem.",
      },
      {
        fa: "هدف، تغییر فرم چهره نیست؛ بلکه بهبود محیط بافتی پوست است.",
        en: "The goal is not to change the shape of the face, but to improve the skin's tissue environment.",
      },
      {
        fa: "Jalupro",
        en: "Jalupro",
      },
      {
        fa: "Jalupro بر پایه ترکیبی از هیالورونیک اسید و آمینواسیدها طراحی شده است.",
        en: "Jalupro is formulated based on a combination of hyaluronic acid and amino acids.",
      },
      {
        fa: "آمینواسیدها از اجزای مورد نیاز برای سنتز پروتئین‌هایی مانند کلاژن هستند و این رویکرد با هدف حمایت از فعالیت فیبروبلاست‌ها و بهبود کیفیت ماتریکس خارج سلولی مورد استفاده قرار می‌گیرد.",
        en: "Amino acids are components required for synthesizing proteins such as collagen, and this approach is used to support fibroblast activity and improve the quality of the extracellular matrix.",
      },
      {
        fa: "بسته به نوع محصول و شرایط پوست، Jalupro می‌تواند در برنامه درمانی برای بهبود texture، خطوط ظریف و کیفیت کلی پوست قرار گیرد.",
        en: "Depending on the product type and skin condition, Jalupro can be included in a treatment plan to improve texture, fine lines, and overall skin quality.",
      },
      {
        fa: "PDRN",
        en: "PDRN",
      },
      {
        fa: "PDRN رویکرد متفاوتی به جوان‌سازی دارد.",
        en: "PDRN takes a different approach to rejuvenation.",
      },
      {
        fa: "این ترکیبات مشتق از قطعات DNA هستند و اثرات بیولوژیک آن‌ها، از جمله مسیرهای مرتبط با گیرنده Adenosine A2A، در زمینه ترمیم بافت، تعدیل التهاب و فرآیندهای Regenerative مورد مطالعه قرار گرفته است.",
        en: "These compounds are derived from DNA fragments, and their biological effects, including pathways related to the adenosine A2A receptor, have been studied in the context of tissue repair, inflammation modulation, and regenerative processes.",
      },
      {
        fa: "به همین دلیل، PDRN بیشتر در چارچوب Regenerative Medicine قابل درک است تا صرفاً یک محصول آبرسان.",
        en: "For this reason, PDRN is better understood within the framework of regenerative medicine rather than simply as a hydrating product.",
      },
      {
        fa: "هدف، فراهم کردن شرایط مناسب‌تر برای عملکرد و ترمیم بافت است.",
        en: "The goal is to provide more favorable conditions for tissue function and repair.",
      },
      {
        fa: "Lanluma",
        en: "Lanluma",
      },
      {
        fa: "Lanluma بر پایه Poly-L-Lactic Acid یا PLLA ساخته شده است و در گروه Collagen Biostimulators قرار می‌گیرد.",
        en: "Lanluma is made from poly-L-lactic acid (PLLA) and belongs to the category of collagen biostimulators.",
      },
      {
        fa: "در این درمان، هدف اصلی تزریق یک حجم آماده به بافت نیست.",
        en: "In this treatment, the main goal is not to inject a ready-made volume into the tissue.",
      },
      {
        fa: "ذرات PLLA یک پاسخ کنترل‌شده در بافت ایجاد می‌کنند که طی هفته‌ها و ماه‌های بعد می‌تواند به تحریک تولید کلاژن منجر شود.",
        en: "PLLA particles create a controlled response in the tissue that, over the following weeks and months, can lead to stimulation of collagen production.",
      },
      {
        fa: "به همین دلیل، نتیجه Lanluma تدریجی است و بیشتر بر بازسازی ساختاری بافت و افزایش تدریجی قوام و support آن تمرکز دارد.",
        en: "For this reason, Lanluma's results are gradual and focus more on the structural regeneration of tissue and a gradual increase in its firmness and support.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "در Outline، انتخاب درمان با نام محصول شروع نمی‌شود.",
        en: "In Outline, treatment selection does not begin with a product name.",
      },
      {
        fa: "ابتدا کیفیت پوست، میزان Laxity، Hydration، خطوط ظریف، ضخامت و شرایط بافت و نشانه‌های Aging بررسی می‌شوند.",
        en: "First, skin quality, the degree of laxity, hydration, fine lines, tissue thickness and condition, and signs of aging are examined.",
      },
      {
        fa: "سپس بر اساس مشکل غالب، درمان مناسب یا ترکیبی از درمان‌ها انتخاب می‌شود.",
        en: "Then, based on the predominant issue, the appropriate treatment or combination of treatments is selected.",
      },
      {
        fa: "ممکن است یک پوست بیشتر به Bio-remodeling نیاز داشته باشد، پوست دیگری به Collagen Biostimulation و در فردی دیگر یک رویکرد regenerative یا ترکیبی منطقی‌تر باشد.",
        en: "One skin may need bio-remodeling more, another may need collagen biostimulation, and for someone else, a regenerative or combined approach may be more logical.",
      },
      {
        fa: "بنابراین سؤال اصلی این نیست:",
        en: "So the main question is not:",
      },
      {
        fa: "«بهترین جوان‌ساز کدام است؟»",
        en: '"Which rejuvenator is the best?"',
      },
      {
        fa: "بلکه سؤال درست این است:",
        en: "But rather, the right question is:",
      },
      {
        fa: "«برای این پوست، در این مرحله، کدام مکانیسم درمانی مناسب‌تر است؟»",
        en: '"For this skin, at this stage, which treatment mechanism is more suitable?"',
      },
      {
        fa: "جوان‌سازی بدون تغییر هویت",
        en: "Rejuvenation Without Changing Identity",
      },
      {
        fa: "فلسفه جوان‌سازی در Outline با فلسفه تزریق صورت یکسان است.",
        en: "The philosophy of rejuvenation in Outline is the same as the philosophy of facial injection.",
      },
      {
        fa: "هدف این نیست که چهره متفاوتی ساخته شود یا تمام نشانه‌های افزایش سن حذف شوند.",
        en: "The goal is not to create a different face or to eliminate all signs of aging.",
      },
      {
        fa: "هدف، کمک به حفظ کیفیت پوست و بازگرداندن بخشی از ویژگی‌هایی است که با گذر زمان کاهش پیدا می‌کنند.",
        en: "The goal is to help maintain skin quality and restore some of the characteristics that diminish over time.",
      },
      {
        fa: "در Outline، جوان‌سازی به معنی پنهان کردن سن نیست؛ به معنی بهتر پیر شدن است.",
        en: "In Outline, rejuvenation does not mean hiding one's age; it means aging better.",
      },
    ],
    "لیفت صورت با نخ": [
      {
        fa: "Thread Lifting",
        en: "Thread Lifting",
      },
      {
        fa: "لیفت با نخ یکی از روش‌های کم‌تهاجمی برای ایجاد تغییر در موقعیت و حمایت از بافت‌های نرم صورت است.",
        en: "Thread lifting is one of the minimally invasive methods for repositioning and supporting the soft tissues of the face.",
      },
      {
        fa: "اما در Outline، هدف از Thread Lifting صرفاً «کشیدن پوست» نیست.",
        en: 'But in Outline, the goal of thread lifting is not simply to "pull the skin."',
      },
      {
        fa: "افزایش سن صورت یک فرآیند چندلایه است. تغییرات استخوان، کاهش یا جابه‌جایی کمپارتمان‌های چربی، تغییر عملکرد سیستم لیگامانی و کاهش کیفیت پوست در کنار یکدیگر باعث تغییر فرم و کانتور چهره می‌شوند.",
        en: "Facial aging is a multilayered process. Bone changes, the reduction or displacement of fat compartments, altered ligament system function, and declining skin quality together cause changes in the shape and contour of the face.",
      },
      {
        fa: "به همین دلیل، نمی‌توان تمام این تغییرات را تنها با کشیدن پوست به سمت بالا اصلاح کرد.",
        en: "For this reason, all of these changes cannot be corrected simply by pulling the skin upward.",
      },
      {
        fa: "یک Thread Lift موفق با انتخاب درست بیمار و طراحی درست Vector آغاز می‌شود.",
        en: "A successful thread lift begins with proper patient selection and correct vector design.",
      },
      {
        fa: "نخ چگونه باعث لیفت می‌شود؟",
        en: "How Do Threads Create a Lift?",
      },
      {
        fa: "نخ‌های مخصوص لیفت دارای ساختارهایی هستند که امکان درگیری با بافت نرم را فراهم می‌کنند.",
        en: "Specialized lifting threads have structures that allow them to engage with soft tissue.",
      },
      {
        fa: "پس از قرارگیری صحیح، این ساختارها می‌توانند بخشی از بافت را در جهت طراحی‌شده Reposition کرده و Support مکانیکی ایجاد کنند.",
        en: "Once correctly placed, these structures can reposition part of the tissue in the designed direction and create mechanical support.",
      },
      {
        fa: "اما اثر نخ تنها محدود به این جابه‌جایی اولیه نیست.",
        en: "However, the effect of the thread is not limited to this initial repositioning alone.",
      },
      {
        fa: "بسته به جنس و ساختار نخ، طی ماه‌های بعد واکنش بافتی اطراف آن می‌تواند با تشکیل کلاژن و تغییرات ماتریکس خارج سلولی همراه باشد.",
        en: "Depending on the material and structure of the thread, the surrounding tissue's response over the following months can be accompanied by collagen formation and changes in the extracellular matrix.",
      },
      {
        fa: "بنابراین Thread Lifting را می‌توان ترکیبی از Mechanical Repositioning و یک Biological Tissue Response دانست.",
        en: "Thread lifting can therefore be considered a combination of mechanical repositioning and a biological tissue response.",
      },
      {
        fa: "Vector مهم‌تر از میزان کشش است",
        en: "Vector Matters More Than the Amount of Tension",
      },
      {
        fa: "یکی از مهم‌ترین قسمت‌های Thread Lifting، طراحی جهت حرکت بافت است.",
        en: "One of the most important parts of thread lifting is designing the direction of tissue movement.",
      },
      {
        fa: "صورت را نمی‌توان صرفاً به سمت بالا کشید.",
        en: "The face cannot simply be pulled upward.",
      },
      {
        fa: "جهت مناسب لیفت باید بر اساس فرم صورت، موقعیت بافت‌های نرم، نقاط Fixation و نتیجه‌ای که قرار است ایجاد شود انتخاب شود.",
        en: "The appropriate lift direction must be chosen based on facial shape, the position of soft tissues, fixation points, and the intended result.",
      },
      {
        fa: "Vector نامناسب ممکن است حتی با ایجاد کشش زیاد، نتیجه‌ای غیرطبیعی ایجاد کند.",
        en: "An unsuitable vector may produce an unnatural result even with a great deal of tension.",
      },
      {
        fa: "در مقابل، یک حرکت محدود اما در جهت صحیح می‌تواند تأثیر بیشتری بر کانتور صورت داشته باشد.",
        en: "In contrast, a limited movement in the correct direction can have a greater effect on facial contour.",
      },
      {
        fa: "در Outline، هدف Maximum Tension نیست؛ Correct Repositioning است.",
        en: "In Outline, the goal is not maximum tension; it is correct repositioning.",
      },
      {
        fa: "چه افرادی کاندید مناسب Thread Lift هستند؟",
        en: "Who Are Good Candidates for a Thread Lift?",
      },
      {
        fa: "تمام افتادگی‌های صورت با نخ قابل اصلاح نیستند.",
        en: "Not all facial sagging can be corrected with threads.",
      },
      {
        fa: "Thread Lifting معمولاً در افرادی که درجات خفیف تا متوسطی از تغییر موقعیت بافت نرم دارند، می‌تواند کاربرد بیشتری داشته باشد.",
        en: "Thread lifting generally has greater applicability in individuals with mild to moderate degrees of soft tissue displacement.",
      },
      {
        fa: "در مقابل، در laxity شدید پوست یا افتادگی قابل‌توجه بافت‌ها، محدودیت‌های این روش باید در نظر گرفته شوند و ممکن است روش‌های دیگری نتیجه مناسب‌تری ایجاد کنند.",
        en: "In contrast, with severe skin laxity or significant tissue sagging, the limitations of this method must be considered, and other methods may produce more suitable results.",
      },
      {
        fa: "به همین دلیل، انتخاب بیمار بخش مهمی از نتیجه درمان است.",
        en: "For this reason, patient selection is an important part of the treatment outcome.",
      },
      {
        fa: "لیفت با نخ یا فیلر؟",
        en: "Thread Lift or Filler?",
      },
      {
        fa: "این دو درمان الزاماً جایگزین یکدیگر نیستند.",
        en: "These two treatments are not necessarily substitutes for one another.",
      },
      {
        fa: "فیلر می‌تواند برای ایجاد Support، اصلاح Volume Loss یا تغییر Projection و Contour استفاده شود؛ در حالی که Thread Lifting بیشتر با Repositioning مکانیکی بافت ارتباط دارد.",
        en: "Filler can be used to create support, correct volume loss, or change projection and contour, while thread lifting is more related to the mechanical repositioning of tissue.",
      },
      {
        fa: "در برخی چهره‌ها یکی از این روش‌ها کافی است و در برخی دیگر، ترکیب صحیح درمان‌ها می‌تواند نتیجه متعادل‌تری ایجاد کند.",
        en: "In some faces, one of these methods is sufficient, while in others, the correct combination of treatments can produce a more balanced result.",
      },
      {
        fa: "نکته مهم این است که برای ایجاد ظاهر لیفت‌شده، همیشه نباید حجم بیشتری به صورت اضافه کرد.",
        en: "The important point is that achieving a lifted appearance does not always require adding more volume to the face.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "پیش از Thread Lifting، صورت به‌صورت سه‌بعدی بررسی می‌شود.",
        en: "Before thread lifting, the face is examined three-dimensionally.",
      },
      {
        fa: "میزان و جهت جابه‌جایی بافت، کیفیت پوست، ساختار Midface و Lower Face و نقاطی که بیشترین تأثیر را بر کانتور صورت دارند ارزیابی می‌شوند.",
        en: "The degree and direction of tissue displacement, skin quality, the structure of the midface and lower face, and the points that have the greatest effect on facial contour are all assessed.",
      },
      {
        fa: "سپس Vectorهای درمان بر اساس آناتومی و ویژگی‌های همان چهره طراحی می‌شوند.",
        en: "Treatment vectors are then designed based on the anatomy and characteristics of that specific face.",
      },
      {
        fa: "هدف این نیست که بیمار بلافاصله بعد از درمان «کشیده‌شدن» صورت خود را ببیند.",
        en: 'The goal is not for the patient to immediately see their face "pulled" right after treatment.',
      },
      {
        fa: "هدف، ایجاد یک Repositioning کنترل‌شده است که با ساختار طبیعی چهره هماهنگ باشد.",
        en: "The goal is to create a controlled repositioning that is in harmony with the face's natural structure.",
      },
      {
        fa: "نتیجه‌ای که به دنبال آن هستیم",
        en: "The Result We Are Aiming For",
      },
      {
        fa: "یک Thread Lift خوب نباید Expression طبیعی صورت را از بین ببرد.",
        en: "A good thread lift should not eliminate the face's natural expression.",
      },
      {
        fa: "چهره نباید بیش از اندازه کشیده یا تغییرشکل‌یافته به نظر برسد.",
        en: "The face should not appear overly pulled or distorted.",
      },
      {
        fa: "نتیجه مطلوب، بازتعریف ظریف کانتور و قرار گرفتن بهتر بافت‌هاست؛ به شکلی که فرد همچنان شبیه خودش باقی بماند.",
        en: "The desired result is a subtle redefinition of the contour and better positioning of the tissues, in a way that the person still looks like themselves.",
      },
      {
        fa: "در Outline، هدف کشیدن صورت نیست؛\nهدف، هدایت بافت به موقعیت مناسب‌تر است.",
        en: "In Outline, the goal is not to pull the face;\nthe goal is to guide the tissue to a more appropriate position.",
      },
    ],
    "لیفت نان‌سرجیکال": [
      {
        fa: "Non-Surgical Lift",
        en: "Non-Surgical Lift",
      },
      {
        fa: "لیفت مؤثر همیشه به معنی اضافه کردن حجم بیشتر یا انجام جراحی نیست.",
        en: "An effective lift does not always mean adding more volume or undergoing surgery.",
      },
      {
        fa: "تغییراتی که با افزایش سن در صورت مشاهده می‌کنیم، تنها در یک لایه اتفاق نمی‌افتند. ساختار استخوان، کمپارتمان‌های چربی، سیستم لیگامانی، کیفیت پوست و ماتریکس خارج سلولی، همگی در طول زمان دچار تغییر می‌شوند.",
        en: "The changes we observe in the face with aging do not occur in just one layer. Bone structure, fat compartments, the ligament system, skin quality, and the extracellular matrix all change over time.",
      },
      {
        fa: "به همین دلیل، تلاش برای اصلاح تمام این تغییرات تنها با یک روش درمانی، همیشه بهترین نتیجه را ایجاد نمی‌کند.",
        en: "For this reason, trying to correct all of these changes with a single treatment method does not always produce the best result.",
      },
      {
        fa: "در متد Outline، Non-Surgical Lift یک پروسیجر واحد نیست؛ یک استراتژی درمانی چندلایه است.",
        en: "In the Outline method, a non-surgical lift is not a single procedure; it is a multilayered treatment strategy.",
      },
      {
        fa: "ما ابتدا مشخص می‌کنیم کدام بخش از ساختار صورت تغییر کرده است و سپس برای هر مشکل، ابزار مناسب آن را انتخاب می‌کنیم.",
        en: "We first determine which part of the facial structure has changed, and then select the appropriate tool for each issue.",
      },
      {
        fa: "هدف، ایجاد بیشترین تغییر ممکن نیست.",
        en: "The goal is not to create the greatest possible change.",
      },
      {
        fa: "هدف، ایجاد دقیق‌ترین تغییر ممکن است.",
        en: "The goal is to create the most precise change possible.",
      },
      {
        fa: "چهار مسیر برای رسیدن به یک هدف",
        en: "Four Paths to One Goal",
      },
      {
        fa: "در Outline، لیفت غیرجراحی می‌تواند از چهار مسیر اصلی دنبال شود:",
        en: "In Outline, a non-surgical lift can be pursued through four main paths:",
      },
      {
        fa: "Structural Support → Skin Tightening → Volume Correction → Tissue Repositioning",
        en: "Structural Support → Skin Tightening → Volume Correction → Tissue Repositioning",
      },
      {
        fa: "اما این مراحل یک پروتکل ثابت نیستند.",
        en: "But these stages are not a fixed protocol.",
      },
      {
        fa: "ممکن است فردی تنها به یک یا دو مورد از آن‌ها نیاز داشته باشد و در فرد دیگری، ترکیبی از چند روش نتیجه مناسب‌تری ایجاد کند.",
        en: "One person may need only one or two of them, while for another, a combination of several methods may produce a more suitable result.",
      },
      {
        fa: "انتخاب و ترتیب درمان‌ها بر اساس آناتومی، کیفیت بافت، نوع Aging و هدف درمانی هر فرد انجام می‌شود.",
        en: "The selection and order of treatments are based on each individual's anatomy, tissue quality, type of aging, and treatment goals.",
      },
      {
        fa: "01 — Structural Lift",
        en: "01 — Structural Lift",
      },
      {
        fa: "ابتدا ساختار",
        en: "Structure First",
      },
      {
        fa: "گاهی آنچه به‌عنوان افتادگی صورت دیده می‌شود، تنها ناشی از شل شدن پوست نیست.",
        en: "Sometimes what appears as facial sagging is not caused solely by loose skin.",
      },
      {
        fa: "کاهش Support در بعضی نقاط ساختاری صورت و تغییر ارتباط میان استخوان، بافت نرم و سیستم لیگامانی می‌تواند باعث شود کانتور چهره نسبت به گذشته متفاوت دیده شود.",
        en: "Reduced support at certain structural points of the face, and altered relationships between bone, soft tissue, and the ligament system, can make the facial contour look different from before.",
      },
      {
        fa: "در این شرایط، اضافه کردن حجم در سطح صورت الزاماً پاسخ مناسبی نیست.",
        en: "In these circumstances, adding volume at the surface of the face is not necessarily the right answer.",
      },
      {
        fa: "در Outline می‌توان از Collagen Biostimulatorهایی مانند Ellansé در نقاط انتخاب‌شده برای ایجاد Support و تحریک کلاژن‌سازی استفاده کرد.",
        en: "In Outline, collagen biostimulators such as Ellansé can be used at selected points to create support and stimulate collagen production.",
      },
      {
        fa: "هدف در این مرحله، ساختن گونه بزرگ‌تر یا پر کردن صورت نیست.",
        en: "The goal at this stage is not to create a larger cheek or fill the face.",
      },
      {
        fa: "هدف، بازسازی Support در نقاطی است که بیشترین تأثیر را بر معماری صورت دارند.",
        en: "The goal is to rebuild support at the points that have the greatest effect on facial architecture.",
      },
      {
        fa: "به همین دلیل ما این مرحله را Structural Lift می‌نامیم.",
        en: "For this reason, we call this stage the Structural Lift.",
      },
      {
        fa: "گاهی مقدار محدودی تغییر در یک نقطه ساختاری می‌تواند بیشتر از تزریق حجم زیاد در نقاط متعدد، بر تناسب چهره تأثیر بگذارد.",
        en: "Sometimes a limited change at one structural point can have a greater effect on facial proportion than injecting a large volume at multiple points.",
      },
      {
        fa: "Structure Before Volume.",
        en: "Structure Before Volume.",
      },
      {
        fa: "02 — Skin Tightening",
        en: "02 — Skin Tightening",
      },
      {
        fa: "لیفت بدون کیفیت پوست کامل نیست",
        en: "A Lift Is Not Complete Without Skin Quality",
      },
      {
        fa: "حتی اگر Support ساختاری مناسبی ایجاد شود، کیفیت پوست همچنان بخش مهمی از نتیجه است.",
        en: "Even if proper structural support is created, skin quality remains an important part of the result.",
      },
      {
        fa: "کاهش کلاژن و تغییرات ماتریکس خارج سلولی می‌توانند به کاهش Firmness و Elasticity پوست منجر شوند.",
        en: "Reduced collagen and changes in the extracellular matrix can lead to decreased skin firmness and elasticity.",
      },
      {
        fa: "در افرادی که این بخش از Aging اهمیت بیشتری دارد، درمان‌هایی با هدف Collagen Biostimulation می‌توانند وارد پلن درمان شوند.",
        en: "In individuals for whom this aspect of aging is more significant, treatments aimed at collagen biostimulation can be included in the treatment plan.",
      },
      {
        fa: "یکی از گزینه‌های مورد استفاده در این رویکرد Lanluma (PLLA) است.",
        en: "One of the options used in this approach is Lanluma (PLLA).",
      },
      {
        fa: "PLLA به‌جای ایجاد یک تغییر حجمی فوری، پاسخ بافتی تدریجی ایجاد می‌کند که با تولید کلاژن جدید همراه است. به همین دلیل، نتیجه آن طی زمان شکل می‌گیرد.",
        en: "Instead of creating an immediate volumetric change, PLLA produces a gradual tissue response accompanied by new collagen production. For this reason, its results develop over time.",
      },
      {
        fa: "هدف این مرحله، کشیدن مکانیکی پوست نیست.",
        en: "The goal of this stage is not mechanical skin pulling.",
      },
      {
        fa: "هدف، بهبود تدریجی کیفیت، قوام و Support بافت است تا نتیجه درمان ساختاری روی بستری با کیفیت بهتر قرار گیرد.",
        en: "The goal is the gradual improvement of tissue quality, firmness, and support, so that the result of the structural treatment rests on a better-quality foundation.",
      },
      {
        fa: "03 — Volume Correction",
        en: "03 — Volume Correction",
      },
      {
        fa: "حجم، فقط جایی که واقعاً از دست رفته است",
        en: "Volume, Only Where It Has Truly Been Lost",
      },
      {
        fa: "یکی از رایج‌ترین اشتباهات در جوان‌سازی صورت، تلاش برای ایجاد لیفت از طریق اضافه کردن حجم زیاد است.",
        en: "One of the most common mistakes in facial rejuvenation is trying to create a lift by adding a large amount of volume.",
      },
      {
        fa: "در Outline، فیلر وسیله‌ای برای «پر کردن صورت» نیست.",
        en: 'In Outline, filler is not a tool for "filling the face."',
      },
      {
        fa: "پس از ارزیابی ساختار و کیفیت بافت، بررسی می‌کنیم که آیا در نقاط مشخصی Volume Deficiency واقعی وجود دارد یا خیر.",
        en: "After evaluating the structure and tissue quality, we assess whether a genuine volume deficiency exists at specific points.",
      },
      {
        fa: "در صورت نیاز، HA Filler می‌تواند برای اصلاح انتخابی این کمبودها، بهبود Projection یا تکمیل تناسب میان اجزای صورت استفاده شود.",
        en: "If needed, HA filler can be used to selectively correct these deficiencies, improve projection, or complete the proportion among facial features.",
      },
      {
        fa: "اما هر فرورفتگی الزاماً نیاز به پر شدن ندارد.",
        en: "But not every hollow necessarily needs to be filled.",
      },
      {
        fa: "و هر علامت Aging نیز با اضافه کردن حجم بهتر نمی‌شود.",
        en: "And not every sign of aging improves by adding volume.",
      },
      {
        fa: "هدف Volume Correction، بازگرداندن تناسب است؛ نه بزرگ‌تر کردن اجزای صورت.",
        en: "The goal of volume correction is to restore proportion, not to enlarge facial features.",
      },
      {
        fa: "04 — Thread Lift",
        en: "04 — Thread Lift",
      },
      {
        fa: "Repositioning به‌جای Filling",
        en: "Repositioning Instead of Filling",
      },
      {
        fa: "گاهی مسئله اصلی نه کمبود حجم است و نه فقط کاهش کیفیت پوست؛ بلکه موقعیت بافت نرم تغییر کرده است.",
        en: "Sometimes the main issue is neither volume deficiency nor simply reduced skin quality; rather, the position of the soft tissue has changed.",
      },
      {
        fa: "در بیمار مناسب، Thread Lift می‌تواند برای ایجاد Mechanical Repositioning کنترل‌شده بافت مورد استفاده قرار گیرد.",
        en: "In an appropriate patient, a thread lift can be used to create controlled mechanical repositioning of the tissue.",
      },
      {
        fa: "اما در Outline، نخ برای ایجاد حداکثر کشش استفاده نمی‌شود.",
        en: "But in Outline, threads are not used to create maximum tension.",
      },
      {
        fa: "Vector لیفت بر اساس جهت تغییر بافت، ساختار صورت و نتیجه مورد انتظار طراحی می‌شود.",
        en: "The lift vector is designed based on the direction of tissue change, facial structure, and the expected result.",
      },
      {
        fa: "هدف این است که بافت در جهت مناسب Reposition شود و نتیجه درمان‌های قبلی، در صورت نیاز، تکمیل شود.",
        en: "The goal is for the tissue to be repositioned in the appropriate direction and, if needed, to complement the results of previous treatments.",
      },
      {
        fa: "Maximum Tension هدف ما نیست؛ Correct Repositioning است.",
        en: "Maximum tension is not our goal; correct repositioning is.",
      },
      {
        fa: "چرا این مراحل با هم متفاوت‌اند؟",
        en: "Why Are These Stages Different From One Another?",
      },
      {
        fa: "چون هرکدام مسئله متفاوتی را هدف قرار می‌دهند.",
        en: "Because each one targets a different issue.",
      },
      {
        fa: "Structural Lift\nبرای ایجاد یا بازگرداندن support ساختاری.",
        en: "Structural Lift\nTo create or restore structural support.",
      },
      {
        fa: "Skin Tightening\nبرای بهبود کیفیت، قوام و پاسخ بیولوژیک بافت.",
        en: "Skin Tightening\nTo improve tissue quality, firmness, and biological response.",
      },
      {
        fa: "Volume Correction\nبرای اصلاح کمبود حجم واقعی و تکمیل proportions.",
        en: "Volume Correction\nTo correct genuine volume deficiency and complete proportions.",
      },
      {
        fa: "Thread Lift\nبرای Repositioning مکانیکی بافت در بیمار مناسب.",
        en: "Thread Lift\nFor mechanical repositioning of tissue in an appropriate patient.",
      },
      {
        fa: "به همین دلیل، استفاده بیشتر از یک روش الزاماً نتیجه بهتری ایجاد نمی‌کند.",
        en: "For this reason, using one method more extensively does not necessarily produce a better result.",
      },
      {
        fa: "هنر طراحی درمان در این است که بدانیم:",
        en: "The art of treatment design lies in knowing:",
      },
      {
        fa: "کدام لایه را درمان کنیم، با چه روشی و تا چه اندازه.",
        en: "Which layer to treat, with which method, and to what extent.",
      },
      {
        fa: "فلسفه Non-Surgical Lift در Outline",
        en: "The Philosophy of Non-Surgical Lift in Outline",
      },
      {
        fa: "در بسیاری از روش‌های جوان‌سازی، سؤال این است:",
        en: "In many rejuvenation approaches, the question is:",
      },
      {
        fa: "«برای لیفت بیشتر چه چیزی اضافه کنیم؟»",
        en: '"What should we add for more lift?"',
      },
      {
        fa: "در Outline سؤال متفاوت است:",
        en: "In Outline, the question is different:",
      },
      {
        fa: "«چه چیزی باعث شده این چهره کمتر از گذشته Support و Definition داشته باشد؟»",
        en: '"What has caused this face to have less support and definition than before?"',
      },
      {
        fa: "اگر مشکل ساختار باشد، ساختار را اصلاح می‌کنیم.",
        en: "If the problem is structural, we correct the structure.",
      },
      {
        fa: "اگر کیفیت بافت کاهش یافته باشد، روی بافت کار می‌کنیم.",
        en: "If tissue quality has declined, we work on the tissue.",
      },
      {
        fa: "اگر حجم واقعاً از دست رفته باشد، حجم را به‌صورت کنترل‌شده بازمی‌گردانیم.",
        en: "If volume has genuinely been lost, we restore it in a controlled manner.",
      },
      {
        fa: "و اگر موقعیت بافت نیاز به اصلاح داشته باشد، در بیمار مناسب از Repositioning استفاده می‌کنیم.",
        en: "And if the tissue's position needs correction, we use repositioning in an appropriate patient.",
      },
      {
        fa: "بنابراین Non-Surgical Lift در Outline یک درمان ثابت نیست؛",
        en: "Therefore, a non-surgical lift in Outline is not a fixed treatment;",
      },
      {
        fa: "یک پلن شخصی‌سازی‌شده برای Aging هر چهره است.",
        en: "it is a personalized plan for the aging of each individual face.",
      },
      {
        fa: "هدف نهایی",
        en: "The Ultimate Goal",
      },
      {
        fa: "هدف ما ساختن صورتی پرتر نیست.",
        en: "Our goal is not to create a fuller-looking face.",
      },
      {
        fa: "هدف، ایجاد صورتی است که Support بهتر، پوست باکیفیت‌تر، Proportions متعادل‌تر و contour تعریف‌شده‌تری داشته باشد؛ در حالی که هویت اصلی فرد حفظ شود.",
        en: "The goal is to create a face with better support, higher-quality skin, more balanced proportions, and a more defined contour, while the person's core identity is preserved.",
      },
      {
        fa: "گاهی این هدف تنها با یک درمان به دست می‌آید و گاهی نیازمند درمان مرحله‌ای است.",
        en: "Sometimes this goal is achieved with just one treatment, and sometimes it requires a staged treatment approach.",
      },
      {
        fa: "و گاهی نیز آناتومی یا میزان افتادگی به شکلی است که روش‌های غیرجراحی انتخاب مناسبی نیستند و جراحی می‌تواند گزینه مؤثرتری باشد.",
        en: "And sometimes the anatomy or degree of sagging is such that non-surgical methods are not a suitable choice, and surgery can be a more effective option.",
      },
      {
        fa: "در Outline، انتخاب درمان بر اساس محدودیت و توانایی واقعی هر روش انجام می‌شود، نه بر اساس یک پروتکل ثابت.",
        en: "In Outline, treatment selection is made based on the real limitations and capabilities of each method, not based on a fixed protocol.",
      },
      {
        fa: "ساختار → کیفیت بافت → حجم → موقعیت بافت",
        en: "Structure → Tissue Quality → Volume → Tissue Position",
      },
      {
        fa: "چهار مسیر متفاوت، با یک هدف مشترک:",
        en: "Four different paths, with one shared goal:",
      },
      {
        fa: "Lift Without Overfilling.",
        en: "Lift Without Overfilling.",
      },
      {
        fa: "لیفت، بدون تغییر هویت چهره.",
        en: "A lift, without changing the identity of the face.",
      },
    ],
    "لیزر فرکشنال CO₂": [
      {
        fa: "Skin Resurfacing & Remodeling",
        en: "Skin Resurfacing & Remodeling",
      },
      {
        fa: "کیفیت پوست فقط با میزان رطوبت یا نبود لک تعریف نمی‌شود.",
        en: "Skin quality is not defined solely by hydration level or the absence of spots.",
      },
      {
        fa: "بافت پوست، منافذ، خطوط ظریف، یکنواختی سطح و کیفیت کلاژن در کنار یکدیگر تعیین می‌کنند که پوست تا چه اندازه صاف، شفاف و جوان به نظر برسد.",
        en: "Skin texture, pores, fine lines, surface evenness, and collagen quality together determine how smooth, clear, and youthful the skin appears.",
      },
      {
        fa: "در Outline، لیزر CO₂ زمانی انتخاب می‌شود که هدف تنها مراقبت از سطح پوست نیست و به بازسازی عمیق‌تر ساختار آن نیاز داریم.",
        en: "In Outline, CO₂ laser is chosen when the goal is not just surface skin care and a deeper reconstruction of its structure is needed.",
      },
      {
        fa: "لیزر CO₂ چگونه عمل می‌کند؟",
        en: "How Does CO₂ Laser Work?",
      },
      {
        fa: "CO₂ یک لیزر Ablative با طول موج 10,600 نانومتر است که انرژی آن به‌شدت توسط آب موجود در بافت جذب می‌شود.",
        en: "CO₂ is an ablative laser with a wavelength of 10,600 nanometers, whose energy is strongly absorbed by the water present in the tissue.",
      },
      {
        fa: "در تکنولوژی Fractional CO₂، به‌جای درمان تمام سطح پوست به‌صورت یکپارچه، ستون‌های میکروسکوپی و کنترل‌شده‌ای از آسیب حرارتی در پوست ایجاد می‌شوند و بخش‌هایی از بافت سالم در اطراف آن‌ها باقی می‌مانند.",
        en: "In fractional CO₂ technology, instead of treating the entire skin surface uniformly, microscopic, controlled columns of thermal injury are created in the skin, with areas of healthy tissue remaining around them.",
      },
      {
        fa: "همین الگوی Fractional امکان ترمیم سریع‌تر بافت را فراهم می‌کند.",
        en: "This fractional pattern allows for faster tissue healing.",
      },
      {
        fa: "پس از درمان، فرآیند طبیعی Wound Healing فعال می‌شود و طی هفته‌ها و ماه‌های بعد Remodeling ماتریکس خارج سلولی و کلاژن ادامه پیدا می‌کند.",
        en: "After treatment, the natural wound-healing process is activated, and over the following weeks and months, remodeling of the extracellular matrix and collagen continues.",
      },
      {
        fa: "بنابراین نتیجه CO₂ فقط مربوط به روزهای اولیه بعد از لیزر نیست.",
        en: "Therefore, the result of CO₂ is not limited to the first few days after the laser session.",
      },
      {
        fa: "بخشی از نتیجه واقعی در ماه‌های بعد ساخته می‌شود.",
        en: "Part of the real result develops over the following months.",
      },
      {
        fa: "CO₂ چه چیزی را درمان می‌کند؟",
        en: "What Does CO₂ Treat?",
      },
      {
        fa: "لیزر Fractional CO₂ می‌تواند بر چند ویژگی مختلف پوست به‌طور هم‌زمان اثر بگذارد و بر اساس شرایط فرد برای بهبود مواردی مانند:",
        en: "Fractional CO₂ laser can simultaneously affect several different skin characteristics and, depending on the individual's condition, be used to improve things such as:",
      },
      {
        fa: "Texture نامنظم پوست، منافذ قابل مشاهده، خطوط ظریف، برخی اسکارهای آکنه، آسیب ناشی از نور خورشید و بعضی اختلالات سطحی pigmentation",
        en: "Irregular skin texture, visible pores, fine lines, certain acne scars, sun-induced damage, and some superficial pigmentation disorders",
      },
      {
        fa: "مورد استفاده قرار گیرد.",
        en: "can be addressed with it.",
      },
      {
        fa: "اما تمام مشکلات پوستی با یک تنظیم و یک عمق درمان نمی‌شوند.",
        en: "However, not all skin problems are treated with the same setting and the same depth.",
      },
      {
        fa: "برای مثال، درمان خطوط ظریف اطراف چشم با درمان یک اسکار آکنه عمیق، هدف و طراحی یکسانی ندارد.",
        en: "For example, treating fine lines around the eyes does not have the same goal and design as treating a deep acne scar.",
      },
      {
        fa: "Controlled Injury. Controlled Repair.",
        en: "Controlled Injury. Controlled Repair.",
      },
      {
        fa: "اساس بسیاری از درمان‌های بازسازی پوست یک مفهوم ساده است:",
        en: "The basis of many skin-resurfacing treatments is a simple concept:",
      },
      {
        fa: "برای تحریک پوست به بازسازی، ابتدا یک آسیب دقیق و کنترل‌شده ایجاد می‌کنیم.",
        en: "To stimulate the skin to regenerate, we first create a precise, controlled injury.",
      },
      {
        fa: "این آسیب مجموعه‌ای از فرآیندهای ترمیمی را فعال می‌کند که در ادامه با Remodeling کلاژن و ماتریکس پوست همراه هستند.",
        en: "This injury activates a set of repair processes that are subsequently accompanied by remodeling of collagen and the skin matrix.",
      },
      {
        fa: "اما در CO₂، انرژی بیشتر الزاماً به معنی نتیجه بهتر نیست.",
        en: "But with CO₂, more energy does not necessarily mean a better result.",
      },
      {
        fa: "عمق، انرژی، Density و تعداد Pass ها باید متناسب با هدف درمان و ویژگی‌های پوست انتخاب شوند.",
        en: "Depth, energy, density, and the number of passes must be chosen according to the treatment goal and the skin's characteristics.",
      },
      {
        fa: "هدف ایجاد بیشترین آسیب نیست؛ ایجاد میزان مناسبی از تحریک برای رسیدن به Remodeling مطلوب است.",
        en: "The goal is not to create the greatest injury; it is to create an appropriate degree of stimulation to achieve the desired remodeling.",
      },
      {
        fa: "چرا درمان برای هر پوست متفاوت است؟",
        en: "Why Is Treatment Different for Each Skin?",
      },
      {
        fa: "رنگ و Fitzpatrick Skin Type، ضخامت پوست، ناحیه درمان، سابقه Pigmentation، میزان Photoaging، وجود اسکار و حتی مدت Downtime قابل قبول برای فرد در طراحی درمان اهمیت دارند.",
        en: "Skin color and Fitzpatrick skin type, skin thickness, the treatment area, history of pigmentation, degree of photoaging, presence of scarring, and even the amount of downtime acceptable to the individual are all important in designing the treatment.",
      },
      {
        fa: "به‌خصوص در پوست‌هایی که استعداد بیشتری برای Post-Inflammatory Hyperpigmentation دارند، انتخاب صحیح بیمار، تنظیم پارامترها و مراقبت‌های قبل و بعد از درمان اهمیت بیشتری پیدا می‌کند.",
        en: "Especially in skin more prone to post-inflammatory hyperpigmentation, correct patient selection, parameter settings, and pre- and post-treatment care become even more important.",
      },
      {
        fa: "به همین دلیل در Outline یک پروتکل ثابت CO₂ برای تمام افراد وجود ندارد.",
        en: "For this reason, there is no fixed CO₂ protocol for everyone in Outline.",
      },
      {
        fa: "شدت درمان باید به اندازه مشکل پوست و ظرفیت ترمیم همان پوست باشد.",
        en: "The intensity of treatment must match the skin's problem and its own healing capacity.",
      },
      {
        fa: "CO₂ و جوان‌سازی ترکیبی",
        en: "CO₂ and Combined Rejuvenation",
      },
      {
        fa: "Aging فقط در سطح پوست اتفاق نمی‌افتد.",
        en: "Aging does not occur only at the surface of the skin.",
      },
      {
        fa: "به همین دلیل CO₂ می‌تواند بخشی از یک برنامه بزرگ‌تر جوان‌سازی باشد، اما جایگزین تمام درمان‌های دیگر نیست.",
        en: "For this reason, CO₂ can be part of a larger rejuvenation program, but it is not a replacement for all other treatments.",
      },
      {
        fa: "در صورت نیاز، درمان‌های دیگری که روی Hydration، Regenerative Signalling، collagen Biostimulation یا ساختار و حجم صورت اثر می‌گذارند می‌توانند در زمان‌بندی مناسب در کنار Resurfacing قرار بگیرند.",
        en: "If needed, other treatments that affect hydration, regenerative signaling, collagen biostimulation, or facial structure and volume can be scheduled alongside resurfacing at the appropriate time.",
      },
      {
        fa: "هر درمان یک لایه متفاوت از Aging را هدف قرار می‌دهد.",
        en: "Each treatment targets a different layer of aging.",
      },
      {
        fa: "رویکرد Outline",
        en: "The Outline Approach",
      },
      {
        fa: "در Outline، ابتدا مشخص می‌کنیم چه چیزی در کیفیت پوست باید تغییر کند:",
        en: "In Outline, we first determine what needs to change in skin quality:",
      },
      {
        fa: "Texture, Fine Lines, Scarring, Pigmentation یا مجموعه‌ای از آن‌ها؟",
        en: "Texture, Fine lines, Scarring, Pigmentation?, Or a combination of these?",
      },
      {
        fa: "سپس عمق و شدت درمان بر اساس همان هدف طراحی می‌شود.",
        en: "The depth and intensity of treatment are then designed based on that specific goal.",
      },
      {
        fa: "زیرا هدف ما انجام یک لیزر قوی‌تر نیست.",
        en: "Because our goal is not to perform a stronger laser.",
      },
      {
        fa: "هدف، ایجاد یک پاسخ ترمیمی مؤثر با کمترین آسیب غیرضروری است.",
        en: "The goal is to create an effective healing response with the least unnecessary injury.",
      },
      {
        fa: "نتیجه‌ای که به دنبال آن هستیم",
        en: "The Result We Are Aiming For",
      },
      {
        fa: "CO₂ قرار نیست فرم صورت را تغییر دهد.",
        en: "CO₂ is not meant to change the shape of the face.",
      },
      {
        fa: "هدف آن بهبود خودِ بستر پوست است؛ پوستی با سطح یکنواخت‌تر، Texture بهتر و کیفیت ساختاری مطلوب‌تر.",
        en: "Its goal is to improve the skin's own foundation — skin with a more even surface, better texture, and more desirable structural quality.",
      },
      {
        fa: "و این تغییر برخلاف بسیاری از درمان‌های فوری، به‌تدریج و هم‌زمان با فرآیند Remodeling پوست شکل می‌گیرد.",
        en: "And unlike many immediate treatments, this change forms gradually, in tandem with the skin's remodeling process.",
      },
      {
        fa: "Resurface. Repair. Remodel.",
        en: "Resurface. Repair. Remodel.",
      },
      {
        fa: "در Outline، جوان‌سازی فقط تغییر کانتور صورت نیست؛ کیفیت پوستی که روی آن قرار گرفته نیز بخشی از زیبایی چهره است.",
        en: "In Outline, rejuvenation is not just about changing the facial contour; the quality of the skin that lies over it is also part of the face's beauty.",
      },
    ],
    "لیزر Helios III Q-Switched": [
      {
        fa: "Pigment Correction & Skin Toning",
        en: "Pigment Correction & Skin Toning",
      },
      {
        fa: "رنگ یکنواخت پوست یکی از مهم‌ترین عناصر کیفیت و شفافیت آن است.",
        en: "Even skin tone is one of the most important elements of skin quality and clarity.",
      },
      {
        fa: "قرار گرفتن در معرض نور خورشید، افزایش سن، التهاب و عوامل مختلف بیولوژیک می‌توانند باعث تغییر در تولید یا توزیع ملانین شوند و به شکل لک، تیرگی یا ناهمگونی رنگ پوست ظاهر شوند.",
        en: "Sun exposure, aging, inflammation, and various biological factors can alter melanin production or distribution, appearing as spots, dark patches, or uneven skin color.",
      },
      {
        fa: "در Outline، درمان Pigmentation با یک اصل شروع می‌شود:",
        en: "In Outline, pigmentation treatment begins with one principle:",
      },
      {
        fa: "هر لک پوستی، یک لک مشابه نیست.",
        en: "Not every skin spot is the same kind of spot.",
      },
      {
        fa: "قبل از انتخاب لیزر باید نوع Pigmentation، عمق آن، رنگ پوست و احتمال پاسخ پوست به التهاب بررسی شود.",
        en: "Before choosing a laser, the type of pigmentation, its depth, skin color, and the skin's likely inflammatory response must be evaluated.",
      },
      {
        fa: "Helios III چیست؟",
        en: "What Is Helios III?",
      },
      {
        fa: "Helios III یک لیزر Q-Switched Nd:YAG است که با دو طول موج اصلی 1064 nm و 532 nm کار می‌کند.",
        en: "Helios III is a Q-switched Nd:YAG laser that operates with two main wavelengths, 1064 nm and 532 nm.",
      },
      {
        fa: "پالس‌های بسیار کوتاه در محدوده نانوثانیه امکان انتقال مقدار بالایی از انرژی در زمان بسیار کوتاه را فراهم می‌کنند.",
        en: "Extremely short pulses in the nanosecond range allow a large amount of energy to be delivered in a very brief time.",
      },
      {
        fa: "هدف اصلی در درمان‌های Pigmentation، رساندن انرژی به Chromophore هدف و ایجاد آسیب انتخابی‌تر در ساختارهای حاوی Pigment است، در حالی که میزان آسیب غیرضروری به بافت اطراف محدود می‌شود.",
        en: "The main goal in pigmentation treatments is to deliver energy to the target chromophore and create more selective damage in pigment-containing structures, while limiting unnecessary damage to surrounding tissue.",
      },
      {
        fa: "این دستگاه علاوه بر دو طول موج، دارای modeها و Handpiece های مختلفی است که امکان طراحی درمان‌های متفاوت را فراهم می‌کنند.",
        en: "In addition to the two wavelengths, this device has various modes and handpieces that allow different treatments to be designed.",
      },
      {
        fa: "532 nm طول موج 532 نانومتر جذب بالاتری توسط ملانین دارد و نفوذ آن نسبت به 1064 nm سطحی‌تر است.",
        en: "532 nm: The 532-nanometer wavelength has higher absorption by melanin, and its penetration is more superficial compared to 1064 nm.",
      },
      {
        fa: "به همین دلیل می‌تواند برای برخی ضایعات پیگمانته سطحی و اپیدرمال مورد استفاده قرار گیرد.",
        en: "For this reason, it can be used for certain superficial and epidermal pigmented lesions.",
      },
      {
        fa: "اما جذب بالاتر ملانین به این معناست که انتخاب بیمار و پارامترهای درمان اهمیت زیادی دارند؛ به‌خصوص در پوست‌های تیره‌تر یا افرادی که مستعد Post-Inflammatory Hyperpigmentation هستند.",
        en: "But higher melanin absorption means that patient selection and treatment parameters are very important, especially in darker skin or individuals prone to post-inflammatory hyperpigmentation.",
      },
      {
        fa: "1064 nm طول موج 1064 نانومتر نفوذ عمیق‌تری در پوست دارد و جذب آن توسط ملانین نسبت به 532 nm کمتر است.",
        en: "1064 nm: The 1064-nanometer wavelength has deeper penetration into the skin, and its absorption by melanin is lower than that of 532 nm.",
      },
      {
        fa: "این ویژگی امکان استفاده از آن را در طیف دیگری از درمان‌های Pigmentary و همچنین پروتکل‌های Laser Toning فراهم می‌کند.",
        en: "This feature allows it to be used in a different range of pigmentary treatments, as well as in laser toning protocols.",
      },
      {
        fa: "در Laser Toning معمولاً هدف ایجاد یک آسیب شدید و قابل مشاهده نیست.",
        en: "In laser toning, the goal is usually not to create a severe, visible injury.",
      },
      {
        fa: "با استفاده از Fluence پایین‌تر و درمان‌های کنترل‌شده، هدف تأثیر بر Pigmentation با حداقل Inflammatory Response غیرضروری است.",
        en: "By using lower fluence and controlled treatments, the goal is to affect pigmentation with minimal unnecessary inflammatory response.",
      },
      {
        fa: "Laser Toning",
        en: "Laser Toning",
      },
      {
        fa: "در برخی اختلالات Pigmentation، درمان تهاجمی‌تر الزاماً نتیجه بهتری ایجاد نمی‌کند.",
        en: "In certain pigmentation disorders, more aggressive treatment does not necessarily produce a better result.",
      },
      {
        fa: "این مسئله خصوصاً در شرایطی مانند Melasma اهمیت دارد؛ زیرا التهاب بیش از حد می‌تواند خود به تشدید یا بازگشت Pigmentation کمک کند.",
        en: "This is especially important in conditions such as melasma, since excessive inflammation can itself contribute to worsening or recurrence of pigmentation.",
      },
      {
        fa: "به همین دلیل، در بیماران انتخاب‌شده می‌توان از رویکردهای کنترل‌شده‌تر با Q-Switched 1064 nm استفاده کرد.",
        en: "For this reason, in selected patients, more controlled approaches with Q-switched 1064 nm can be used.",
      },
      {
        fa: "هدف:",
        en: "The goal:",
      },
      {
        fa: "Less Inflammation. More Control.",
        en: "Less Inflammation. More Control.",
      },
      {
        fa: "نه اینکه پوست را مجبور کنیم در یک جلسه تغییر کند، بلکه درمان را متناسب با بیولوژی Pigmentation طراحی کنیم.",
        en: "Not to force the skin to change in a single session, but to design the treatment according to the biology of the pigmentation.",
      },
      {
        fa: "Helios III برای چه مواردی استفاده می‌شود؟",
        en: "What Is Helios III Used For?",
      },
      {
        fa: "بسته به تشخیص و نوع پوست، Helios III می‌تواند در برنامه درمانی برخی از مشکلات مربوط به Pigmentation، لک‌های سطحی، Uneven Skin Tone و skin Toning قرار گیرد.",
        en: "Depending on the diagnosis and skin type, Helios III can be included in the treatment plan for certain pigmentation issues, superficial spots, uneven skin tone, and skin toning.",
      },
      {
        fa: "Q-Switched Nd:YAG همچنین یکی از تکنولوژی‌های شناخته‌شده در درمان برخی انواع Tattoo است.",
        en: "Q-switched Nd:YAG is also one of the well-known technologies for treating certain types of tattoos.",
      },
      {
        fa: "اما انتخاب Wavelength و Protocol باید بر اساس ماهیت و عمق Chromophore هدف انجام شود.",
        en: "But the choice of wavelength and protocol must be based on the nature and depth of the target chromophore.",
      },
      {
        fa: "Melasma متفاوت است",
        en: "Melasma Is Different",
      },
      {
        fa: "Melasma را نباید صرفاً تجمعی از Pigment در نظر گرفت که باید با انرژی بیشتر تخریب شود.",
        en: "Melasma should not be viewed simply as an accumulation of pigment that must be destroyed with more energy.",
      },
      {
        fa: "این بیماری پیچیده‌تر است و عوامل مختلفی از جمله فعالیت Melanocyte، نور و UV، التهاب و تغییرات محیط پوستی در آن نقش دارند.",
        en: "This condition is more complex, and various factors, including melanocyte activity, light and UV exposure, inflammation, and changes in the skin environment, play a role in it.",
      },
      {
        fa: "به همین دلیل، لیزر در Melasma معمولاً باید بخشی از یک Treatment Strategy باشد، نه تنها درمان بیمار.",
        en: "For this reason, laser in melasma usually needs to be part of a treatment strategy, not the patient's only treatment.",
      },
      {
        fa: "کنترل نور، درمان‌های موضعی مناسب و مدیریت عوامل تحریک‌کننده می‌توانند به اندازه انتخاب دستگاه اهمیت داشته باشند.",
        en: "Light control, appropriate topical treatments, and management of triggering factors can be just as important as the choice of device.",
      },
      {
        fa: "رویکرد Outline قبل از درمان با Helios III ابتدا مشخص می‌کنیم:",
        en: "The Outline Approach: Before treatment with Helios III, we first determine:",
      },
      {
        fa: "در چه عمقی قرار دارد؟ Pigment چیست؟",
        en: "What is the pigment, and at what depth is it located?",
      },
      {
        fa: "Skin Type بیمار چیست؟ و پوست تا چه اندازه مستعد PIH است؟",
        en: "What is the patient's skin type, and how prone is the skin to PIH?",
      },
      {
        fa: "سپس Wavelength، Mode و شدت درمان بر اساس همین ارزیابی انتخاب می‌شوند.",
        en: "The wavelength, mode, and treatment intensity are then chosen based on this assessment.",
      },
      {
        fa: "در Outline هدف استفاده از بالاترین انرژی ممکن نیست.",
        en: "In Outline, the goal is not to use the highest possible energy.",
      },
      {
        fa: "هدف، رساندن انرژی مناسب به Target مناسب است.",
        en: "The goal is to deliver the right energy to the right target.",
      },
      {
        fa: "CO₂ یا Q-Switched?",
        en: "CO₂ or Q-Switched?",
      },
      {
        fa: "این دو لیزر نقش یکسانی ندارند.",
        en: "These two lasers do not play the same role.",
      },
      {
        fa: "Fractional CO₂ بیشتر زمانی اهمیت پیدا می‌کند که هدف اصلی Skin Resurfacing، Texture، Fine Lines، برخی انواع Scar و Remodelling پوست باشد.",
        en: "Fractional CO₂ becomes more important when the main goal is skin resurfacing, texture, fine lines, certain types of scarring, and skin remodeling.",
      },
      {
        fa: "در مقابل، Helios III Q-Switched بیشتر در حوزه Pigmentation، Pigmented Lesions و Skin Toning جای می‌گیرد.",
        en: "In contrast, the Helios III Q-switched laser fits more within the domain of pigmentation, pigmented lesions, and skin toning.",
      },
      {
        fa: "در برخی بیماران ممکن است هر دو مشکل وجود داشته باشند و درمان مرحله‌ای با تکنولوژی‌های متفاوت منطقی‌تر باشد.",
        en: "In some patients, both issues may be present, and staged treatment with different technologies may be more logical.",
      },
      {
        fa: "نتیجه‌ای که به دنبال آن هستیم",
        en: "The Result We Are Aiming For",
      },
      {
        fa: "هدف درمان Pigmentation ایجاد پوستی مصنوعی و بدون هیچ Variation رنگی نیست.",
        en: "The goal of pigmentation treatment is not to create artificial-looking skin with absolutely no color variation.",
      },
      {
        fa: "هدف، کاهش Pigmentation ناخواسته و ایجاد پوستی یکنواخت‌تر و شفاف‌تر، بدون ایجاد التهاب و آسیب غیرضروری است.",
        en: "The goal is to reduce unwanted pigmentation and create more even, clearer skin, without causing unnecessary inflammation and damage.",
      },
      {
        fa: "Target the Pigment. Respect The Skin.",
        en: "Target the Pigment. Respect the Skin.",
      },
      {
        fa: "در Outline، لک را فقط نمی‌بینیم؛ رفتار پوستی که آن لک را ساخته است نیز در نظر می‌گیریم.",
        en: "In Outline, we do not just see the spot; we also consider the skin behavior that created it.",
      },
    ],
  };

  return (
    <Fragment>
      <NextSeo
        title={language ? "متد اوت‌لاین" : "Outline Method"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/method"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/method",
          title: language ? "متد اوت‌لاین" : "Outline Method",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت‌لاین",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      <section
        className={classes.container}
        style={{
          fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
          direction: language ? "rtl" : "ltr",
        }}
      >
        <div className={classes.imageBox}>
          <div className="fadeOverlayTop"></div>
          <Image
            src="https://bucket.outlinecommunity.com/resources/earth.jpg"
            blurDataURL="https://bucket.outlinecommunity.com/resources/earth.jpg"
            placeholder="blur"
            alt="About"
            layout="fill"
            objectFit="cover"
            as="image"
            priority
          />
          <div className={classes.title}>
            <h1>{language ? "متد اوت‌لاین" : "Outline Method"}</h1>
          </div>
          <div className={classes.scrollDown} onClick={() => scrollToDivBox()}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.category} ref={targetBox}>
          {methodTypes
            .map((item, index) => (
              <div
                key={index}
                className={
                  item.item.fa === selectTopic
                    ? classes.itemActive
                    : classes.item
                }
                onClick={() => setSelectTopic(item.item.fa)}
              >
                <h4
                  className={classes.text}
                  key={index}
                  style={{
                    fontFamily: language ? "Yekan-Light" : "Titillium-Thin",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: applyFontToEnglishWords(
                      item.item[languageType],
                      "Titillium-Thin",
                      languageType,
                    ),
                  }}
                ></h4>
              </div>
            ))
            .slice(0, 5)}
        </div>
        <div className={classes.categorySecond}>
          {methodTypes
            .map((item, index) => (
              <div
                key={index}
                className={
                  item.item.fa === selectTopic
                    ? classes.itemActive
                    : classes.item
                }
                onClick={() => setSelectTopic(item.item.fa)}
              >
                <h4
                  className={classes.text}
                  key={index}
                  style={{
                    fontFamily: language ? "Yekan-Light" : "Titillium-Thin",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: applyFontToEnglishWords(
                      item.item[languageType],
                      "Titillium-Thin",
                      languageType,
                    ),
                  }}
                ></h4>
              </div>
            ))
            .slice(5, 9)}
        </div>

        <div className={classes.content}>
          {texts[selectTopic]?.map((text, index) => (
            <h3
              className={classes.text}
              key={index}
              style={{
                fontFamily: language ? "Yekan-Light" : "Titillium-Thin",
              }}
              dangerouslySetInnerHTML={{
                __html: applyFontToEnglishWords(
                  text[languageType],
                  "Titillium-Thin",
                  languageType,
                ),
              }}
            ></h3>
          ))}
        </div>
      </section>
    </Fragment>
  );
}
