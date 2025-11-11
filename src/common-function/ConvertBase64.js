function getBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result, null);
    };
    reader.onerror = function (error) {
        callback(null, error);
    };
}

const getBase64Promise = function (file) {
    return new Promise((resolve, reject) => {
        getBase64(file, (success, err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(success);
            }
        });
    });
};

export default getBase64Promise;