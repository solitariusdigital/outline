import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./reception.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import {
  toEnglishNumber,
  isEnglishNumber,
  getCurrentDateFarsi,
  convertPersianDate,
  fourGenerator,
} from "@/services/utility";
import { createUserApi, getUsersApi } from "@/services/api";

export default function Reception() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [referral, setReferral] = useState("");
  const [sharePermission, setSharePermission] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([
    { active: false, label: "جراحی" },
    { active: false, label: "آلرژی" },
    { active: false, label: "فشار خون" },
    { active: false, label: "دیابت" },
    { active: false, label: "سابقه سرطان" },
    { active: false, label: "بیماری ریوی" },
    { active: false, label: "بیماری انعقادی" },
    { active: false, label: "بیماری قلبی" },
  ]);
  const [medicalHistoryFamily, setMedicalHistoryFamily] = useState([
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
    { active: false, label: "سابقه خاصی ندارم" },
    { active: false, label: "مصرف سیگار" },
    { active: false, label: "مصرف الکل" },
    { active: false, label: "مصرف قلیان" },
  ]);
  const [medicalHistoryDescription, setMedicalHistoryDescription] =
    useState("");
  const [medicineHistory, setMedicineHistory] = useState("");
  const [medicalHistoryFamilyDescription, setMedicalHistoryFamilyDescription] =
    useState("");
  const [verification, setVerification] = useState("");

  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [displayForm, setDisplayForm] = useState(true);

  const renderCustomInput = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      value={
        birthDate
          ? `${birthDate.day}/${birthDate.month}/${birthDate.year}`
          : "انتخاب"
      }
      style={{
        textAlign: "center",
        padding: "1rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "100px",
        outline: "none",
        height: "50px",
        background: "none",
      }}
    />
  );

  const handleVerification = async () => {
    let verificationEnglish = isEnglishNumber(verification)
      ? verification
      : toEnglishNumber(verification);

    if (verificationEnglish.length < 10) {
      showAlert("کد ملی یا موبایل اشتباه");
      return;
    }
    if (verificationEnglish.length === 10) {
      console.log("code");
    } else if (verificationEnglish.length === 11) {
      if (verificationEnglish.startsWith("09")) {
        console.log("mobile");
      } else {
        showAlert("موبایل اشتباه");
      }
    }
    // setDisplayForm(true);
  };

  const handleSubmit = async () => {
    // setDisableButton(true);
    const [currentYear] = getCurrentDateFarsi().split("/");
    let phoneEnglish = isEnglishNumber(phone) ? phone : toEnglishNumber(phone);
    let telEnglish = isEnglishNumber(tel) ? tel : toEnglishNumber(tel);
    let idEnglish = isEnglishNumber(id) ? id : toEnglishNumber(id);
    let recordId = convertPersianDate(getCurrentDateFarsi()) + fourGenerator();

    if (
      !name ||
      !birthDate ||
      !id ||
      !phone ||
      !tel ||
      !address ||
      !occupation ||
      !confirmation
    ) {
      showAlert("موارد ستاره‌دار الزامیست");
      setDisableButton(false);
      return;
    }

    if (phoneEnglish.length !== 11 || !phoneEnglish.startsWith("09")) {
      showAlert("موبایل اشتباه");
      setDisableButton(false);
      return;
    }
    if (idEnglish.length !== 10) {
      showAlert("کد ملی اشتباه");
      setDisableButton(false);
      return;
    }

    let userId = null;
    const appUsers = await getUsersApi();
    const userData = appUsers.find((user) => user.phone === phoneEnglish);
    if (userData) {
      userId = userData["_id"];
    } else {
      const user = {
        name: "",
        phone: phoneEnglish,
        permission: "patient",
      };
      const userData = await createUserApi(user);
      userId = userData["_id"];
    }

    const recordObject = {
      recordId: recordId,
      name: name.trim(),
      birthDate: birthDate,
      age: toEnglishNumber(currentYear) - birthDate.year,
      id: idEnglish,
      phone: phoneEnglish,
      tel: telEnglish,
      address: address.trim(),
      occupation: occupation.trim(),
      referral: referral.trim(),
      sharePermission: sharePermission,
      confirmation: confirmation,
      medicalHistory: medicalHistory,
      medicalHistoryFamily: medicalHistoryFamily,
      habits: habits,
    };
  };

  const handleMedicalHistoryChange = (index, isActive) => {
    setMedicalHistory((prevState) =>
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
    setMedicalHistoryFamily((prevState) =>
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
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
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
        {!displayForm && (
          <section className={classes.formEntry}>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>
                  کد ملی یا موبایل خود را وارد کنید
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
                    نام کامل
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setName("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
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
                    تاریخ تولد
                    <span>*</span>
                  </p>
                </div>
                <div>
                  <DatePicker
                    value={birthDate}
                    onChange={setBirthDate}
                    renderInput={renderCustomInput}
                    locale="fa"
                  />
                </div>
              </div>

              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    کد ملی
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setId("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="tel"
                  id="id"
                  name="id"
                  onChange={(e) => setId(e.target.value)}
                  value={id}
                  autoComplete="off"
                  dir="rtl"
                  maxLength={10}
                />
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
                    شماره ثابت
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setTel("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  onChange={(e) => setTel(e.target.value)}
                  value={tel}
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
                  <p className={classes.label}>نام معرف</p>
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
                <p>
                  اینجانب رضایت دارم تا عکس من قبل و بعد از درمان در صورت لزوم
                  در مقالات پزشکی و شبکه اجتماعی به صورت ناشناس قرار گیرد
                </p>
                {sharePermission ? (
                  <RadioButtonCheckedIcon
                    className="icon"
                    onClick={() => setSharePermission(false)}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    className="icon"
                    onClick={() => setSharePermission(true)}
                  />
                )}
              </div>
            </section>
            <h3>تاریخچه پزشکی بیمار</h3>
            <section className={classes.form}>
              {medicalHistory.map((option, index) => (
                <div key={index} className={classes.options}>
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  {option.active ? (
                    <RadioButtonCheckedIcon
                      className="icon"
                      onClick={
                        () => handleMedicalHistoryChange(index, false) // Toggle to false
                      }
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      className="icon"
                      onClick={
                        () => handleMedicalHistoryChange(index, true) // Toggle to true
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
                    onClick={() => setMedicalHistoryDescription("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicalHistoryDescription"
                  name="medicalHistoryDescription"
                  onChange={(e) => setMedicalHistoryDescription(e.target.value)}
                  value={medicalHistoryDescription}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>سابقه دارویی</p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setMedicineHistory("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicineHistory"
                  name="medicineHistory"
                  onChange={(e) => setMedicineHistory(e.target.value)}
                  value={medicineHistory}
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
                      className="icon"
                      onClick={
                        () => handleHabitsChange(index, false) // Toggle to false
                      }
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      className="icon"
                      onClick={
                        () => handleHabitsChange(index, true) // Toggle to true
                      }
                    />
                  )}
                </div>
              ))}
            </section>
            <h3>تاریخچه پزشکی اعضاء خانواده درجه ۱ و ۲</h3>
            <section className={classes.form}>
              {medicalHistoryFamily.map((option, index) => (
                <div key={index} className={classes.options}>
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  {option.active ? (
                    <RadioButtonCheckedIcon
                      className="icon"
                      onClick={
                        () => handleMedicalHistoryFamilyChange(index, false) // Toggle to false
                      }
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      className="icon"
                      onClick={
                        () => handleMedicalHistoryFamilyChange(index, true) // Toggle to true
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
                    onClick={() => setMedicalHistoryFamilyDescription("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  type="text"
                  id="medicalHistoryFamilyDescription"
                  name="medicalHistoryFamilyDescription"
                  onChange={(e) =>
                    setMedicalHistoryFamilyDescription(e.target.value)
                  }
                  value={medicalHistoryFamilyDescription}
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
