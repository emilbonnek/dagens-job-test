const ENDPOINT = 'http://localhost:3001/products';
const CATEGORIES = ['meat', 'fish', 'greens'];

const FormCreateProduct = () => {
  const submissionHandler = async (event) => {
    event.preventDefault();

    const form = event.target;

    const body = new FormData(form);
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      body,
    });

    if (response.ok) {
      form.reset();
    } else {
      alert(`Failed to create product - error code: ${response.status}`);
    }
  };

  return (
    <form className="form-create-product" onSubmit={submissionHandler}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" required autoComplete="off" />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select name="category" required>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input type="number" name="price" required />
      </div>
      <div className="form-group">
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default FormCreateProduct;
