import * as fs from 'fs';

fs.readFile("./project/conf/managed.json", "utf8", (error, data) => {
    if (error) {
        console.log(error);
        return;
    }
    let r = []
    const managedObjects: ManagedObjects = JSON.parse(data);
    managedObjects.objects.forEach(managedObject => {
        let r1 = managedObject.name;
        let r2 = []
        var logger = fs.createWriteStream('output/' + managedObject.name + ".mermaid", {
            flags: 'w' // 'a' means appending (old data will be preserved)
        })
        logger.write("erDiagram\n")
        logger.write("\t" + managedObject.name + " {\n")
        Object.keys(managedObject.schema.properties).forEach(key => {
            let type: string = managedObject.schema.properties[key].type + '' as string
            if (type === 'array') {
                let i = managedObject.schema.properties[key].items;
                let t = i.type;
                if (t === 'relationship') {
                    let r = i.resourceCollection.reduce((a, { path }) => a.concat(path.split('/')[1]), []);
                    r2.push(r)
                    t = t.concat("_").concat(r.join(','))
                }
                type = type + "[" + t + "]";
            }
            let policies = managedObject.schema.properties[key].policies;
            let policyEntry = "";
            let PK = ""
            if (policies) {
                let policyIds = policies.reduce((a, { policyId }) => a.concat(policyId), []);
                policyEntry = " \"" + policyIds.join(",") + "\""
                if (policyIds.some(e => e === 'unique')) {
                    PK = " PK"
                }
            }
            logger.write("\t\t" + type.split(",")[0] + " " + key + PK + policyEntry + "\n");
        })
        logger.write("\t}\n")
        logger.close();
        let r3 = r2.reduce((accumulator, value) => accumulator.concat(value), [])
        r.push({ n: r1, r: r3.filter((item, index) => r3.indexOf(item) == index) })
    })
    var logger = fs.createWriteStream('output/relationships.mermaid', {
        flags: 'w' // 'a' means appending (old data will be preserved)
    })
    logger.write("erDiagram\n")
    r.forEach(relationship => {
        relationship.r.forEach(d => {
            logger.write("\t" + relationship.n + " || --|| " + d + " : has\n");
        })
    })
    logger.close()
});