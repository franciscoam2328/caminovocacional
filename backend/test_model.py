import joblib
import sys

old_model_path = 'c:/Users/USER/Downloads/caminovocacional/backend/infra/model_ia/modelo_vocacional_rbf_final.pkl'
new_model_path = 'c:/Users/USER/Downloads/caminovocacional/backend/infra/model_ia/random_forest_vocacional.pkl'

print("Loading new model...")
try:
    new_model = joblib.load(new_model_path)
    print("New model loaded successfully!")
    print("Type:", type(new_model))
    if hasattr(new_model, 'n_features_in_'):
        print("n_features_in_:", new_model.n_features_in_)
    if hasattr(new_model, 'classes_'):
        print("classes_:", new_model.classes_)
except Exception as e:
    print("Error loading new model:", e)

print("Loading old model...")
try:
    old_model = joblib.load(old_model_path)
    print("Old model type:", type(old_model))
    if hasattr(old_model, 'n_features_in_'):
        print("old n_features_in_:", old_model.n_features_in_)
except Exception as e:
    print("Error loading old model:", e)
