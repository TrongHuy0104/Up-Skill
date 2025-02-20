import InstructorSidebar from "@/components/custom/InstructorSibeBar";


const Sidebar = () => {
    return (
        <div>
            <InstructorSidebar
                address={'PO Box 16122 Collins Street West'}
                email={'info@upskill.com'}
                phoneNumber={'0362028005'}
                web="www.alitfn.com"
            />
        </div>
    );
};

export default Sidebar;