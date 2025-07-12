import fs from 'fs';
import path from 'path';

var FileRetriever;
(function (FileRetriever) {
    FileRetriever.directory = (props) => {
        const location = path.join(props.location, props.file);
        if (fs.existsSync(location))
            return props.location;
        else if ((props.depth ?? 0) > 2)
            return null;
        return FileRetriever.directory({
            file: props.file,
            location: path.join(props.location, ".."),
            depth: (props.depth ?? 0) + 1,
        });
    };
})(FileRetriever || (FileRetriever = {}));

export { FileRetriever };
//# sourceMappingURL=FileRetriever.mjs.map
