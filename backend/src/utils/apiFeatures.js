class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search
  search() {
    if (this.queryString.keyword) {
      this.query = this.query.find({
        name: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      });
    }

    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "sort",
    ];

    removeFields.forEach((key) => delete queryObj[key]);

    this.query = this.query.find(queryObj);

    return this;
  }

  // Sort
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;