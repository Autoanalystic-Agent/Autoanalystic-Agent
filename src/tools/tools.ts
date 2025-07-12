export class DateTool {
  private today: string;

  constructor() {
    // Assign Today's Date.
    this.today = new Date().toISOString().split("T")[0];
  }

  /**
   * DateTool.
   * Returns the current date.
   */
  getToday(): string {
    return this.today;
  }

  /**
   * DateTool.
   * Sets the current date.
   */
  setToday(input: {
    /**
     * date format : "YYYY-MM-DD"
     */
    date: string;
  }) {
    this.today = input.date;
  }
}

export class WeatherTool {
  private weather: Record<string, string>;

  constructor() {
    this.weather = {
      "2028": "snowy",
      "2027": "rainy",
      "2026": "sunny",
      "2025": "cloudy",
      "2024": "rainy",
    };
  }

  /**
   * WeatherTool.
   * Returns the weather of the given year.
   */
  getTodayWeather(input: {
    /**
     * date format : "YYYY-MM-DD"
     */
    today: string;
  }): string {
    const year = input.today.split("-")[0];

    return this.weather[year];
  }
}