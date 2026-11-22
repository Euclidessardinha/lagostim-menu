
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdminProductForm.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getProductImagePath(imageUrl) {
  if (!imageUrl) return null;

  const marker =
    "/storage/v1/object/public/product-images/";

  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  return decodeURIComponent(
    imageUrl.substring(markerIndex + marker.length).split("?")[0]
  );
}

function AdminProductForm({ product, onCancel, onSaved }) {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [portion, setPortion] = useState("");

  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] =
    useState(false);

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) {
        console.error(
          "Erro ao carregar categorias:",
          categoriesError
        );

        setError("Não foi possível carregar as categorias.");
        setCategoriesLoading(false);
        return;
      }

      setCategories(data || []);
      setCategoriesLoading(false);
    };

    loadCategories();
  }, []);

  // Preencher o formulário quando estiver a editar
  useEffect(() => {
    setName(product?.name || "");
    setCategoryId(product?.category_id || "");

    setPrice(
      product?.price !== null && product?.price !== undefined
        ? String(product.price)
        : ""
    );

    setDescription(product?.description || "");

    setIngredients(
      Array.isArray(product?.ingredients)
        ? product.ingredients.join(", ")
        : ""
    );

    setPreparationTime(product?.preparation_time || "");
    setPortion(product?.portion || "");

    setFeatured(product?.featured ?? false);
    setAvailable(product?.available ?? true);

    setImageFile(null);
    setImagePreview(product?.image || "");
    setRemoveExistingImage(false);
    setError("");
  }, [product]);

  // Criar e limpar a pré-visualização temporária da imagem
  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Escolha uma imagem JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("A imagem não pode ultrapassar 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveExistingImage(true);

    const fileInput = document.getElementById(
      "admin-product-image"
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Digite o nome do produto.");
      return;
    }

    if (!price || !Number.isFinite(Number(price)) || Number(price) < 0) {
      setError("Introduza um preço válido.");
      return;
    }

    setLoading(true);

    let uploadedImagePath = null;
    let imageUrl = null;

    try {
      // Enviar nova imagem, se existir
      if (imageFile) {
        const extensionByType = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };

        const extension = extensionByType[imageFile.type];
        const fileName = `${crypto.randomUUID()}.${extension}`;

        uploadedImagePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(uploadedImagePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          throw new Error(
            uploadError.message || "Não foi possível enviar a imagem."
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadedImagePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const ingredientsArray = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const productData = {
        name: name.trim(),
        category_id: categoryId || null,
        price: Number(price),
        description: description.trim() || null,
        ingredients: ingredientsArray,
        preparation_time: preparationTime.trim() || null,
        portion: portion.trim() || null,
        featured,
        available,
      };

      let saveError;

      if (product) {
        const updateData = {
          ...productData,
        };

        if (imageFile) {
          updateData.image = imageUrl;
        } else if (removeExistingImage) {
          updateData.image = null;
        }

        const result = await supabase
          .from("products")
          .update(updateData)
          .eq("id", product.id);

        saveError = result.error;
      } else {
        const result = await supabase
          .from("products")
          .insert({
            id: crypto.randomUUID(),
            ...productData,
            image: imageUrl,
          });

        saveError = result.error;
      }

      if (saveError) {
        throw new Error(
          saveError.message || "Não foi possível guardar o produto."
        );
      }

      // Só depois de guardar o produto é que removemos a imagem antiga
      if (product && (imageFile || removeExistingImage) && product.image) {
        const oldImagePath = getProductImagePath(product.image);

        if (oldImagePath) {
          const { error: removeOldImageError } = await supabase.storage
            .from("product-images")
            .remove([oldImagePath]);

          if (removeOldImageError) {
            console.warn(
              "Não foi possível remover a imagem antiga:",
              removeOldImageError
            );
          }
        }
      }

      setLoading(false);

      if (onSaved) {
        onSaved();
      }
    } catch (submitError) {
      console.error("Erro ao guardar produto:", submitError);

      // Evitar deixar uma imagem enviada sem estar associada a um produto
      if (uploadedImagePath) {
        await supabase.storage
          .from("product-images")
          .remove([uploadedImagePath]);
      }

      setError(
        submitError.message || "Ocorreu um erro ao guardar o produto."
      );

      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <div className="admin-product-form-header">
        <div>
          <span className="admin-product-form-eyebrow">
            {product ? "GESTÃO DE PRODUTOS" : "NOVO REGISTO"}
          </span>

          <h2>
            {product ? "Editar produto" : "Adicionar produto"}
          </h2>

          <p>
            Preencha as informações do prato para apresentar no menu.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="admin-product-form-close"
          disabled={loading}
          aria-label="Fechar formulário"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <div className="admin-form-section-heading">
            <span className="admin-form-section-number">01</span>
            <div>
              <h3>Informações principais</h3>
              <p>Nome, categoria e preço do produto.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="admin-product-name">
                Nome do produto *
              </label>

              <input
                id="admin-product-name"
                type="text"
                placeholder="Ex.: Camarão Grelhado"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-product-category">
                Categoria
              </label>

              <select
                id="admin-product-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading
                    ? "A carregar categorias..."
                    : "Selecione uma categoria"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-product-price">
                Preço (MT) *
              </label>

              <div className="admin-price-input">
                <input
                  id="admin-product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex.: 850"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
                <span>MT</span>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-product-portion">
                Porção
              </label>

              <input
                id="admin-product-portion"
                type="text"
                placeholder="Ex.: 1 pessoa"
                value={portion}
                onChange={(event) => setPortion(event.target.value)}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-product-preparation">
                Tempo de preparação
              </label>

              <input
                id="admin-product-preparation"
                type="text"
                placeholder="Ex.: 25 min"
                value={preparationTime}
                onChange={(event) =>
                  setPreparationTime(event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-heading">
            <span className="admin-form-section-number">02</span>
            <div>
              <h3>Fotografia do produto</h3>
              <p>Adicione uma imagem para valorizar o prato no menu.</p>
            </div>
          </div>

          <div className="admin-image-upload-area">
            {imagePreview ? (
              <div className="admin-image-preview">
                <img src={imagePreview} alt="Pré-visualização do produto" />

                <div className="admin-image-preview-info">
                  <strong>Imagem selecionada</strong>
                  <span>
                    Esta fotografia será apresentada no menu.
                  </span>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="admin-image-remove"
                  >
                    Remover imagem
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="admin-product-image"
                className="admin-image-upload-label"
              >
                <span className="admin-image-upload-icon">↑</span>
                <strong>Escolher fotografia</strong>
                <span>
                  Clique para selecionar uma imagem do seu dispositivo.
                </span>
                <small>JPG, PNG ou WebP · Máximo 5 MB</small>
              </label>
            )}

            {imagePreview && (
              <label
                htmlFor="admin-product-image"
                className="admin-image-change-label"
              >
                Escolher outra fotografia
              </label>
            )}

            <input
              id="admin-product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={loading}
              className="admin-image-file-input"
            />
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-heading">
            <span className="admin-form-section-number">03</span>
            <div>
              <h3>Descrição e ingredientes</h3>
              <p>Apresente o prato e os seus ingredientes.</p>
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="admin-product-description">
              Descrição
            </label>

            <textarea
              id="admin-product-description"
              placeholder="Descreva o produto..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="admin-product-ingredients">
              Ingredientes
            </label>

            <input
              id="admin-product-ingredients"
              type="text"
              placeholder="Ex.: Camarão, alho, limão, manteiga"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
            />

            <small>Separe os ingredientes por vírgulas.</small>
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-heading">
            <span className="admin-form-section-number">04</span>
            <div>
              <h3>Visibilidade no menu</h3>
              <p>Defina como o produto será apresentado aos clientes.</p>
            </div>
          </div>

          <div className="admin-form-options">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
              />

              <span className="admin-checkbox-content">
                <strong>⭐ Produto em destaque</strong>
                <small>Dar maior visibilidade a este produto.</small>
              </span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
              />

              <span className="admin-checkbox-content">
                <strong>Produto disponível</strong>
                <small>Permitir que os clientes o vejam como disponível.</small>
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="admin-product-form-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        <div className="admin-product-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="admin-product-cancel"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="admin-product-save"
            disabled={loading || categoriesLoading}
          >
            {loading
              ? "A guardar..."
              : product
                ? "Guardar alterações"
                : "Guardar produto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
