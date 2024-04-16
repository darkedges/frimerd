
interface ManagedObjects {
    objects: ManagedObject[];
}

interface ManagedObject {
    name: string;
    schema: ManagedObjectSchema;
}

interface ManagedObjectSchema {
    order: string[]
    properties: Map<string, ManagedObjectProperties>;
}

interface ManagedObjectProperties {
    type: string;
    policies: ManagedObjectPolicies[];
    items: ManagedObjectPropertyItem;
}

interface ManagedObjectPolicies {
    policyId: string
}

interface ManagedObjectPropertyItem {
    type: string;
    resourceCollection: any[]
}

interface ManagedObjectPropertyItemResourceCollecton {
    path: string;
    label: string;
}