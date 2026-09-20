import { Router } from "express";
import { authRoutes } from "../auth/auth.routes";
import { userRoutes } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/category/category.route";
import { serviceRoutes } from "../modules/service/service.route";
import { technicianPublicRoutes, technicianRoutes } from "../modules/technician/technician.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { reviewRoutes } from "../modules/review/review.route";
import { adminRoutes } from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
    { path: "/auth", route: authRoutes },
    { path: "/users", route: userRoutes },
    { path: "/categories", route: categoryRoutes },
    { path: "/services", route: serviceRoutes },
    { path: "/technicians", route: technicianPublicRoutes },
    { path: "/technician", route: technicianRoutes },
    { path: "/bookings", route: bookingRoutes },
    { path: "/payments", route: paymentRoutes },
    { path: "/reviews", route: reviewRoutes },
    { path: "/admin", route: adminRoutes },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;


