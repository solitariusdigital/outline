import { useState, Fragment } from "react";
import classes from "./reception.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckIcon from "@mui/icons-material/Check";
import loaderImage from "@/assets/loader.png";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import {
  toEnglishNumber,
  isEnglishNumber,
  getCurrentDateFarsi,
  convertPersianDate,
  fourGenerator,
} from "@/services/utility";
import {
  createRecordApi,
  createUserApi,
  getRecordsApi,
  getUsersApi,
  updateRecordApi,
  getVisitsApi,
} from "@/services/api";

export default function Reception() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [idMeli, setIdMeli] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [referral, setReferral] = useState("");
  const [sharePermission, setSharePermission] = useState(true);
  const [confirmation, setConfirmation] = useState(false);
  const [medical, setMedical] = useState([
    { active: false, label: "جراحی" },
    { active: false, label: "آلرژی" },
    { active: false, label: "فشار خون" },
    { active: false, label: "دیابت" },
    { active: false, label: "سابقه سرطان" },
    { active: false, label: "بیماری ریوی" },
    { active: false, label: "بیماری انعقادی" },
    { active: false, label: "بیماری قلبی" },
  ]);
  const [medicalFamily, setMedicalFamily] = useState([
    { active: false, label: "جراحی" },
    { active: false, label: "آلرژی" },
    { active: false, label: "فشار خون" },
    { active: false, label: "دیابت" },
    { active: false, label: "سابقه سرطان" },
    { active: false, label: "بیماری ریوی" },
    { active: false, label: "بیماری انعقادی" },
    { active: false, label: "بیماری قلبی" },
  ]);
  const [habits, setHabits] = useState([
    { active: false, label: "سابقه ندارم" },
    { active: false, label: "مصرف سیگار" },
    { active: false, label: "مصرف الکل" },
    { active: false, label: "مصرف قلیان" },
  ]);
  const [medicalDescription, setMedicalDescription] = useState("");
  const [medicalFamilyDescription, setMedicalFamilyDescription] = useState("");
  const [medicineDescription, setMedicineDescription] = useState("");

  const [verification, setVerification] = useState("");
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);
  const [selectDoctor, setSelectDoctor] = useState("");
  const doctors = ["دکتر فراهانی", "دکتر گنجه", "دکتر پورقلی"];
  const router = useRouter();

  const checkConvertNumber = (number) => {
    return isEnglishNumber(number) ? number : toEnglishNumber(number);
  };

  const handleVerification = async () => {
    setDisableButton(true);
    const verificationEnglish = checkConvertNumber(verification);
    if (verificationEnglish.length < 9) {
      showAlert("کدملی یا موبایل اشتباه");
      setDisableButton(false);
      return;
    }
    const getRecordData = await getRecordsApi();
    if (verificationEnglish.length <= 10) {
      const userRecord = getRecordData.find(
        (user) => user.idMeli === verificationEnglish
      );
      if (userRecord) {
        assignUserRecord(userRecord);
      } else {
        setIdMeli(verificationEnglish);
      }
      setDisplayForm(true);
    } else if (verificationEnglish.length === 11) {
      if (verificationEnglish.startsWith("09")) {
        const userId = await getUserId(verificationEnglish);
        const userRecord = getRecordData.find((user) => user.userId === userId);
        if (userRecord) {
          assignUserRecord(userRecord);
        } else {
          setPhone(verificationEnglish);
        }
        setDisplayForm(true);
      } else {
        showAlert("موبایل اشتباه");
      }
    }
    setDisableButton(false);
  };

  const assignUserRecord = (userRecord) => {
    const birthDateParts = userRecord.birthDate.split("/").map(Number);
    // Assuming the format is DD/MM/YYYY
    let day, month, year;
    if (birthDateParts[0] > 12) {
      // Likely YYYY/MM/DD format
      [year, month, day] = birthDateParts;
    } else {
      // Likely DD/MM/YYYY format
      [day, month, year] = birthDateParts;
    }
    const dateObject = {
      day: String(day),
      month: String(month),
      year: String(year),
    };
    setBirthDate(dateObject);
    setName(userRecord.name);
    setIdMeli(userRecord.idMeli);
    setPhone(userRecord.phone);
    setAddress(userRecord.address);
    setOccupation(userRecord.occupation);
    setExistingRecord(userRecord);
  };

  const getUserId = async (verificationEnglish) => {
    let userId = null;
    const appUsers = await getUsersApi();
    const userData = appUsers.find(
      (user) => user.phone === verificationEnglish
    );
    if (userData) {
      userId = userData["_id"];
    } else {
      const user = {
        name: "",
        phone: verificationEnglish,
        permission: "patient",
      };
      const userData = await createUserApi(user);
      userId = userData["_id"];
    }
    return userId;
  };

  const getUserTime = async (verificationEnglish) => {
    try {
      const userId = await getUserId(verificationEnglish);
      const visits = await getVisitsApi();

      const userVisit = visits.find((visit) => visit.userId === userId);
      if (userVisit) {
        const incompleteVisits = visits.filter(
          (visit) =>
            visit.userId === userId && !visit.completed && !visit.canceled
        );
        if (incompleteVisits.length > 0) {
          return {
            time: incompleteVisits[0].time.split(" - ")[1],
            id: incompleteVisits[0]["_id"],
          };
        } else {
          return {
            time: "بدون نوبت",
            id: null,
          };
        }
      } else {
        return {
          time: "بدون نوبت",
          id: null,
        };
      }
    } catch (error) {
      console.error("Error fetching user time:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setDisableButton(true);

    const fields = [
      { value: name, message: "نام الزامیست" },
      { value: selectDoctor, message: "انتخاب دکتر الزامیست" },
      { value: idMeli, message: "کدملی الزامیست" },
      { value: birthDate.year, message: "سال تولد الزامیست" },
      { value: birthDate.month, message: "ماه تولد الزامیست" },
      { value: birthDate.day, message: "روز تولد الزامیست" },
      { value: phone, message: "موبایل الزامیست" },
      { value: address, message: "آدرس الزامیست" },
      { value: occupation, message: "شغل الزامیست" },
      { value: referral, message: "معرف الزامیست" },
      { value: confirmation, message: "صحت اطلاعات الزامیست" },
    ];
    for (const field of fields) {
      if (!field.value) {
        showAlert(field.message);
        setDisableButton(false);
        return;
      }
    }

    const [currentYear] = getCurrentDateFarsi().split("/");
    let phoneEnglish = checkConvertNumber(phone);
    let idEnglish = checkConvertNumber(idMeli);
    let birthYear = checkConvertNumber(birthDate.year);
    let digitalDate = convertPersianDate(getCurrentDateFarsi());
    let recordId = digitalDate + fourGenerator();
    let { time, id: visitId } = await getUserTime(phoneEnglish);

    if (birthYear.length !== 4 || !birthYear.startsWith("13")) {
      showAlert("سال تولد اشتباه");
      setDisableButton(false);
      return;
    }
    if (phoneEnglish.length !== 11 || !phoneEnglish.startsWith("09")) {
      showAlert("موبایل اشتباه");
      setDisableButton(false);
      return;
    }
    if (idEnglish.length !== 9 && idEnglish.length !== 10) {
      showAlert("کدملی اشتباه");
      setDisableButton(false);
      return;
    }
    if (isAllSameCharacter(idEnglish)) {
      showAlert("کدملی اشتباه");
      setDisableButton(false);
      return;
    }

    setDisplayForm(false);
    setDisplayMessage(true);

    const userId = await getUserId(phoneEnglish);
    const recordObject = {
      name: name.trim(),
      birthDate: `${birthYear}/${checkConvertNumber(
        birthDate.month
      )}/${checkConvertNumber(birthDate.day)}`,
      age: toEnglishNumber(currentYear) - birthYear,
      idMeli: idEnglish,
      userId: userId,
      recordId: recordId,
      phone: phoneEnglish,
      address: address.trim(),
      occupation: occupation.trim(),
      referral: referral.trim(),
      date: digitalDate,
      visitId: visitId,
      time: time,
      confirmation: confirmation,
      records: [],
      checkup: false,
      completed: false,
    };
    const recordData = {
      doctor: selectDoctor,
      date: getCurrentDateFarsi(),
      medicalDescription: medicalDescription,
      medicalFamilyDescription: medicalFamilyDescription,
      medicineDescription: medicineDescription,
      medical: medical,
      medicalFamily: medicalFamily,
      habits: habits,
      sharePermission: sharePermission,
      visitHistory: {
        فیلر: [],
        بوتاکس: [],
        مزوتراپی: [],
        جوانساز: [],
        "پی آر پی": [],
        آنزیم: [],
        سونوگرافی: [],
      },
      comment: "",
      message: "",
    };
    if (existingRecord) {
      recordObject.id = existingRecord["_id"];
      recordObject.recordId = existingRecord.recordId;
      recordObject.records = [...existingRecord.records];
      recordObject.records.push(recordData);
      await updateRecordApi(recordObject);
    } else {
      recordObject.records.push(recordData);
      await createRecordApi(recordObject);
    }
    setTimeout(() => {
      router.reload(router.asPath);
    }, 3000);
  };

  const isAllSameCharacter = (str) => {
    return str.split("").every((char) => char === str[0]);
  };

  const handleMedicalHistoryChange = (index, isActive) => {
    setMedical((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, active: isActive } : item
      )
    );
  };
  const handleHabitsChange = (index, isActive) => {
    setHabits((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, active: isActive } : item
      )
    );
  };
  const handleMedicalHistoryFamilyChange = (index, isActive) => {
    setMedicalFamily((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, active: isActive } : item
      )
    );
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <Fragment>
      <NextSeo
        title="پذیرش"
        description="کلینیک زیبایی"
        canonical="https://outlinecommunity.com/reception"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/reception",
          title: "پذیرش",
          description: "کلینیک زیبایی",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "پذیرش",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      <div className={classes.container}>
        {displayMessage && (
          <div className={classes.message}>
            <h3>پرونده شما ثبت شد. لطفا به پذیرش مراجعه کنید</h3>
            <CheckIcon sx={{ fontSize: 60, color: "#2d2b7f" }} />
          </div>
        )}
        {!displayForm && !displayMessage && (
          <section className={classes.formEntry}>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  کدملی یا موبایل خود را وارد کنید
                  <span>*</span>
                </p>
                <CloseIcon
                  className="icon"
                  onClick={() => setVerification("")}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                type="tel"
                id="verification"
                name="verification"
                onChange={(e) => setVerification(e.target.value)}
                value={verification}
                autoComplete="off"
                dir="rtl"
                maxLength={11}
              />
            </div>
            <button
              className={classes.button}
              disabled={disableButton}
              onClick={() => handleVerification()}
            >
              بعدی
            </button>
            {disableButton && (
              <div className={classes.loader}>
                <Image
                  width={50}
                  height={50}
                  src={loaderImage}
                  alt="isLoading"
                  unoptimized
                />
              </div>
            )}
            <p className={classes.alert}>{alert}</p>
          </section>
        )}
        {displayForm && (
          <Fragment>
            <h3>مشخصات بیمار</h3>
            <section className={classes.form}>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    نام و نام خانوادگی
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setName("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  placeholder="فارسی وارد کنید"
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    انتخاب دکتر
                    <span>*</span>
                  </p>
                </div>
                <select
                  defaultValue={"default"}
                  onChange={(e) => {
                    setSelectDoctor(e.target.value);
                  }}
                >
                  <option value="default" disabled>
                    {selectDoctor ? selectDoctor : "انتخاب"}
                  </option>
                  {doctors.map((doctor, index) => {
                    return (
                      <option key={index} value={doctor}>
                        {doctor}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    کدملی
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setIdMeli("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="tel"
                  id="idMeli"
                  name="idMeli"
                  onChange={(e) => setIdMeli(e.target.value)}
                  value={idMeli}
                  autoComplete="off"
                  dir="rtl"
                  maxLength={10}
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    تاریخ تولد
                    <span>*</span>
                  </p>
                </div>
                <div className={classes.inputBirth}>
                  <input
                    placeholder="15"
                    type="tel"
                    id="day"
                    name="day"
                    onChange={(e) =>
                      setBirthDate((prev) => ({ ...prev, day: e.target.value }))
                    }
                    value={birthDate.day}
                    autoComplete="off"
                    dir="rtl"
                    maxLength={2}
                  />
                  <input
                    placeholder="05"
                    type="tel"
                    id="month"
                    name="month"
                    onChange={(e) =>
                      setBirthDate((prev) => ({
                        ...prev,
                        month: e.target.value,
                      }))
                    }
                    value={birthDate.month}
                    autoComplete="off"
                    dir="rtl"
                    maxLength={2}
                  />
                  <input
                    placeholder="1365"
                    type="tel"
                    id="year"
                    name="year"
                    onChange={(e) =>
                      setBirthDate((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }))
                    }
                    value={birthDate.year}
                    autoComplete="off"
                    dir="rtl"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    موبایل
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setPhone("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  placeholder="09123456789"
                  type="tel"
                  id="phone"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  autoComplete="off"
                  dir="rtl"
                  maxLength={11}
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    آدرس محل سکونت
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setAddress("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    شغل
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setOccupation("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  onChange={(e) => setOccupation(e.target.value)}
                  value={occupation}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    معرف
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setReferral("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="referral"
                  name="referral"
                  onChange={(e) => setReferral(e.target.value)}
                  value={referral}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div>
                <p
                  style={{
                    marginBottom: "12px",
                  }}
                >
                  عکس قبل و بعد برای تکمیل پرونده شما گرفته میشود
                </p>
                <p>
                  اینجانب رضایت دارم تا عکس من قبل و بعد از درمان در صورت لزوم
                  در مقالات پزشکی و شبکه اجتماعی به صورت ناشناس قرار گیرد
                </p>
                <div className={classes.row}>
                  <div className={classes.row}>
                    <p>بله</p>
                    {sharePermission ? (
                      <RadioButtonCheckedIcon
                        sx={{ fontSize: 28 }}
                        className="icon"
                        onClick={() => setSharePermission(false)}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        sx={{ fontSize: 28 }}
                        className="icon"
                        onClick={() => setSharePermission(true)}
                      />
                    )}
                  </div>
                  <div className={classes.row}>
                    <p>خیر</p>
                    {!sharePermission ? (
                      <RadioButtonCheckedIcon
                        sx={{ fontSize: 28 }}
                        className="icon"
                        onClick={() => setSharePermission(true)}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        sx={{ fontSize: 28 }}
                        className="icon"
                        onClick={() => setSharePermission(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
            <h3>تاریخچه پزشکی بیمار</h3>
            <section className={classes.form}>
              {medical.map((option, index) => (
                <div key={index} className={classes.options}>
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  {option.active ? (
                    <RadioButtonCheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() => handleMedicalHistoryChange(index, false)}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() => handleMedicalHistoryChange(index, true)}
                    />
                  )}
                </div>
              ))}
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>توضیحات</p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setMedicalDescription("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicalDescription"
                  name="medicalDescription"
                  onChange={(e) => setMedicalDescription(e.target.value)}
                  value={medicalDescription}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>سابقه دارویی</p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setMedicineDescription("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicineDescription"
                  name="medicineDescription"
                  onChange={(e) => setMedicineDescription(e.target.value)}
                  value={medicineDescription}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
            </section>
            <h3>عادات بیمار</h3>
            <section className={classes.form}>
              {habits.map((option, index) => (
                <div key={index} className={classes.options}>
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  {option.active ? (
                    <RadioButtonCheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() => handleHabitsChange(index, false)}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() => handleHabitsChange(index, true)}
                    />
                  )}
                </div>
              ))}
            </section>
            <h3>تاریخچه پزشکی اعضاء خانواده</h3>
            <section className={classes.form}>
              {medicalFamily.map((option, index) => (
                <div key={index} className={classes.options}>
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  {option.active ? (
                    <RadioButtonCheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() =>
                        handleMedicalHistoryFamilyChange(index, false)
                      }
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ fontSize: 28 }}
                      className="icon"
                      onClick={() =>
                        handleMedicalHistoryFamilyChange(index, true)
                      }
                    />
                  )}
                </div>
              ))}
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>توضیحات</p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setMedicalFamilyDescription("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicalFamilyDescription"
                  name="medicalFamilyDescription"
                  onChange={(e) => setMedicalFamilyDescription(e.target.value)}
                  value={medicalFamilyDescription}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
            </section>
            <div className={classes.formAction}>
              {name && (
                <div className={classes.disclaimer}>
                  <p>
                    <span>{name}</span>
                    <span className={classes.star}>*</span>
                  </p>
                  <p>
                    در تاریخ <span>{getCurrentDateFarsi()}</span> صحت اطلاعات
                    فوق را تایید میکنم
                  </p>
                  {confirmation ? (
                    <RadioButtonCheckedIcon
                      className="icon"
                      onClick={() => setConfirmation(false)}
                    />
                  ) : (
                    <Fragment>
                      <RadioButtonUncheckedIcon
                        className="icon"
                        onClick={() => setConfirmation(true)}
                      />
                    </Fragment>
                  )}
                </div>
              )}
              <button
                className={classes.button}
                disabled={disableButton}
                onClick={() => handleSubmit()}
              >
                تایید
              </button>
              {disableButton && (
                <div className={classes.loader}>
                  <Image
                    width={50}
                    height={50}
                    src={loaderImage}
                    alt="isLoading"
                    unoptimized
                  />
                </div>
              )}
              <p className={classes.alert}>{alert}</p>
            </div>
          </Fragment>
        )}
        <div>
          <Image width={200} height={140} src={logo} alt="logo" priority />
        </div>
      </div>
    </Fragment>
  );
}
