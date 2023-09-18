const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

function compressDirectory(inputDir, outputZip) {
    const output = fs.createWriteStream(outputZip)
    const archive = archiver("zip", {
        zlib: { level: 9 }
    })

    output.on("close", () => {
        console.log("Compression completed")
    })

    archive.on("warning", err => {
        if(err.code === "ENOENT") {
            console.warn(err)
        } else {
            throw err
        }
    })

    archive.on("error", err => {
        throw err
    })

    archive.pipe(output)
    archive.directory(inputDir, path.basename(inputDir))
    archive.finalize()
}

const inputDirectory = "./dist"
const ouputZipFile = "./refine.zip"

compressDirectory(inputDirectory, ouputZipFile)