let cities = [
  { arabicName: "اربد", name: "Irbid" },
  { arabicName: "عمان", name: "Amman" },
  { arabicName: "العقبة", name: "Aqaba" },
];

for (let city of cities) {
  const content = `<option value="${city.arabicName}">${city.arabicName}</option>`;
  document.getElementById("cities-select").innerHTML += content;
}

let savedCityArabic = localStorage.getItem("selectedCity") || "اربد";

document.getElementById("cities-select").value = savedCityArabic;

document.getElementById("city-name").innerHTML = savedCityArabic;

let savedCityEnglish =
  cities.find((city) => city.arabicName === savedCityArabic)?.name || "Irbid";

getPrayersTimingOfCity(savedCityEnglish);

document
  .getElementById("cities-select")
  .addEventListener("change", function () {
    const selectedArabic = this.value;
    document.getElementById("city-name").innerHTML = selectedArabic;

    localStorage.setItem("selectedCity", selectedArabic);

    const selectedCity =
      cities.find((city) => city.arabicName === selectedArabic)?.name ||
      "Irbid";
    getPrayersTimingOfCity(selectedCity);
  });

function getPrayersTimingOfCity(cityName) {
  let params = {
    country: "JO",
    city: cityName,
  };
  axios
    .get("http://api.aladhan.com/v1/timingsByCity", { params })
    .then(function (response) {
      const timing = response.data.data.timings;
      fillTimeForPrayer("fajr-time", timing.Fajr);
      fillTimeForPrayer("sunrise-time", timing.Sunrise);
      fillTimeForPrayer("dhuhr-time", timing.Dhuhr);
      fillTimeForPrayer("asr-time", timing.Asr);
      fillTimeForPrayer("sunset-time", timing.Sunset);
      fillTimeForPrayer("isha-time", timing.Isha);

      const readableDate = response.data.data.date.readable;
      const weekDay = response.data.data.date.hijri.weekday.ar;
      const date = weekDay + " " + readableDate;
      document.getElementById("date").innerHTML = date;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fillTimeForPrayer(id, time) {
  document.getElementById(id).innerHTML = time;
}
